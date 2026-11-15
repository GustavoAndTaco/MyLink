import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./Firebase";
import { BlockItem, SocialLinks, UserAccountInfo, UserProfile } from "@/types";
import { defaultProfileData } from "./mockData";

function getUserDocRef(uid: string) {
  return doc(db, "users", uid);
}

function getLinksCollection(uid: string) {
  return collection(db, "users", uid, "links");
}

/**
 * 이메일 주소의 '@' 앞부분을 추출하여 displayName으로 사용합니다.
 */
export function getDisplayNameFromEmail(
  email?: string | null,
  fallback?: string | null
): string {
  if (email && email.includes("@")) {
    const prefix = email.split("@")[0]?.trim();
    if (prefix) return prefix;
  }
  return fallback?.trim() || "developer";
}

/**
 * Firestore는 undefined 필드 저장을 허용하지 않으므로 재귀적으로 제거합니다.
 */
function stripUndefined<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => stripUndefined(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = stripUndefined(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

export interface EnsureUserResult {
  userProfile: UserProfile;
  socialLinks: SocialLinks;
  accountInfo: UserAccountInfo;
}

/**
 * 로그인한 사용자의 users/{uid} 문서를 조회하거나 초기화합니다.
 * displayName은 이메일의 앞부분을 사용하며 updatedAt 타임스탬프를 갱신합니다.
 */
export async function ensureUserDocInFirestore(authUser: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}): Promise<EnsureUserResult> {
  const userRef = getUserDocRef(authUser.uid);
  const snap = await getDoc(userRef);
  const now = Date.now();
  const email = authUser.email ?? "";
  const displayName = getDisplayNameFromEmail(email, authUser.displayName);

  if (!snap.exists()) {
    const initialUserProfile: UserProfile = stripUndefined({
      ...defaultProfileData.user,
      username: displayName,
      fullName: displayName,
      avatar: authUser.photoURL || defaultProfileData.user.avatar,
    });
    const initialSocialLinks: SocialLinks = {
      ...defaultProfileData.socialLinks,
      email,
    };

    await setDoc(userRef, {
      displayName,
      email,
      photoURL: authUser.photoURL ?? "",
      user: initialUserProfile,
      socialLinks: stripUndefined(initialSocialLinks),
      createdAt: now,
      updatedAt: now,
    });

    return {
      userProfile: initialUserProfile,
      socialLinks: initialSocialLinks,
      accountInfo: {
        uid: authUser.uid,
        email,
        displayName,
        photoURL: authUser.photoURL ?? undefined,
        updatedAt: now,
      },
    };
  }

  const data = snap.data();
  const storedUser = (data?.user as Partial<UserProfile>) ?? {};
  const storedSocials = (data?.socialLinks as SocialLinks) ?? defaultProfileData.socialLinks;

  await updateDoc(userRef, {
    displayName,
    email,
    photoURL: authUser.photoURL ?? "",
    updatedAt: now,
  });

  const mergedUserProfile: UserProfile = {
    ...defaultProfileData.user,
    ...storedUser,
    username: storedUser.username || displayName,
    fullName: storedUser.fullName || displayName,
    avatar: storedUser.avatar || authUser.photoURL || defaultProfileData.user.avatar,
  };

  return {
    userProfile: mergedUserProfile,
    socialLinks: storedSocials,
    accountInfo: {
      uid: authUser.uid,
      email,
      displayName,
      photoURL: authUser.photoURL ?? undefined,
      updatedAt: now,
    },
  };
}

export interface PublicProfileResult {
  uid: string;
  displayName: string;
  userProfile: UserProfile;
  socialLinks: SocialLinks;
  links: BlockItem[];
}

/**
 * displayName으로 Firestore users 컬렉션을 검색하고,
 * 일치하는 사용자의 프로필과 users/{userId}/links 목록을 반환합니다.
 */
export async function fetchPublicUserByDisplayName(
  displayName: string
): Promise<PublicProfileResult | null> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("displayName", "==", displayName), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const userDoc = snapshot.docs[0];
  const data = userDoc.data();
  const storedUser = (data?.user as Partial<UserProfile>) ?? {};
  const storedSocials = (data?.socialLinks as SocialLinks) ?? defaultProfileData.socialLinks;
  const links = await fetchLinksFromFirestore(userDoc.id);

  return {
    uid: userDoc.id,
    displayName: (data?.displayName as string) || displayName,
    userProfile: {
      ...defaultProfileData.user,
      ...storedUser,
      username: storedUser.username || displayName,
      fullName: storedUser.fullName || displayName,
    },
    socialLinks: storedSocials,
    links,
  };
}

/**
 * users/{uid} 문서에서 사용자 프로필 정보를 조회합니다.
 */
export async function fetchUserProfileFromFirestore(
  uid: string
): Promise<UserProfile | null> {
  const userRef = getUserDocRef(uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    return null;
  }
  const data = snap.data();
  return (data?.user as UserProfile) ?? null;
}

/**
 * users/{uid} 문서의 사용자 프로필(이름, 아바타, 소개글 등)을 updateDoc으로 업데이트하고
 * updatedAt 타임스탬프를 갱신합니다.
 */
export async function updateUserProfileInFirestore(
  uid: string,
  updates: Partial<Pick<UserProfile, "fullName" | "avatar" | "bio" | "role">>,
  socialLinks?: SocialLinks
): Promise<number> {
  const userRef = getUserDocRef(uid);
  const snap = await getDoc(userRef);
  const now = Date.now();

  if (!snap.exists()) {
    await setDoc(userRef, {
      user: stripUndefined({
        ...defaultProfileData.user,
        ...updates,
      }),
      ...(socialLinks ? { socialLinks: stripUndefined(socialLinks) } : {}),
      createdAt: now,
      updatedAt: now,
    });
    return now;
  }

  const patchPayload: Record<string, unknown> = {
    updatedAt: now,
  };
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      patchPayload[`user.${key}`] = value;
    }
  }
  if (socialLinks) {
    patchPayload.socialLinks = stripUndefined(socialLinks);
  }
  await updateDoc(userRef, patchPayload);
  return now;
}

/**
 * users/{uid}/links 컬렉션에서 링크 목록을 createdAt 기준 최신순(내림차순)으로 조회합니다.
 * 데이터가 없으면 빈 배열([])을 반환합니다.
 */
export async function fetchLinksFromFirestore(uid: string): Promise<BlockItem[]> {
  const linksRef = getLinksCollection(uid);
  const q = query(linksRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((docSnap) => ({
    ...(docSnap.data() as BlockItem),
    id: docSnap.id,
  }));
}

/**
 * 새 링크를 users/{uid}/links/{id} 문서로 저장합니다.
 */
export async function addLinkToFirestore(
  uid: string,
  block: BlockItem
): Promise<BlockItem> {
  const linksRef = getLinksCollection(uid);
  const docRef = doc(linksRef, block.id);
  const now = Date.now();
  const payload: BlockItem = {
    ...block,
    clickCount: block.clickCount ?? 0,
    createdAt: block.createdAt ?? now,
    updatedAt: now,
  };
  await setDoc(docRef, stripUndefined(payload));
  await updateDoc(getUserDocRef(uid), { updatedAt: now }).catch(() => {});
  return payload;
}

/**
 * 기존 링크 문서를 updateDoc으로 수정하고 updatedAt을 갱신합니다.
 */
export async function updateLinkInFirestore(
  uid: string,
  block: BlockItem
): Promise<BlockItem> {
  const linksRef = getLinksCollection(uid);
  const docRef = doc(linksRef, block.id);
  const now = Date.now();

  const payload: Record<string, unknown> = {
    type: block.type,
    title: block.title,
    isActive: block.isActive,
    clickCount: block.clickCount ?? 0,
    createdAt: block.createdAt ?? now,
    updatedAt: now,
    subtitle: block.subtitle ? block.subtitle : deleteField(),
    url: block.url ? block.url : deleteField(),
    icon: block.icon ? block.icon : deleteField(),
    badge: block.badge ? block.badge : deleteField(),
    pinnedRepo: block.pinnedRepo ? stripUndefined(block.pinnedRepo) : deleteField(),
    techStack: block.techStack ? block.techStack : deleteField(),
    project: block.project ? stripUndefined(block.project) : deleteField(),
  };

  await updateDoc(docRef, payload);
  await updateDoc(getUserDocRef(uid), { updatedAt: now }).catch(() => {});
  return { ...block, updatedAt: now };
}

/**
 * 링크 문서를 deleteDoc으로 삭제합니다.
 */
export async function deleteLinkFromFirestore(uid: string, id: string): Promise<void> {
  const linksRef = getLinksCollection(uid);
  const docRef = doc(linksRef, id);
  await deleteDoc(docRef);
  await updateDoc(getUserDocRef(uid), { updatedAt: Date.now() }).catch(() => {});
}

/**
 * 링크 클릭 시 Firestore의 clickCount를 1 증가시킵니다.
 */
export async function incrementLinkClickInFirestore(
  uid: string,
  id: string
): Promise<void> {
  const linksRef = getLinksCollection(uid);
  const docRef = doc(linksRef, id);
  await updateDoc(docRef, {
    clickCount: increment(1),
    updatedAt: Date.now(),
  });
}

/**
 * 드래그 앤 드롭으로 변경된 순서가 createdAt 기준 최신순 정렬에서도 유지되도록
 * 배열 순서대로 createdAt, order, updatedAt을 일괄 업데이트합니다.
 */
export async function reorderLinksInFirestore(
  uid: string,
  blocks: BlockItem[]
): Promise<BlockItem[]> {
  const linksRef = getLinksCollection(uid);
  const batch = writeBatch(db);
  const baseTime = Date.now();

  const updated = blocks.map((block, index) => {
    const nextBlock: BlockItem = {
      ...block,
      createdAt: baseTime - index * 1000,
      order: index,
      updatedAt: baseTime,
    };
    const docRef = doc(linksRef, block.id);
    batch.update(docRef, {
      createdAt: nextBlock.createdAt,
      order: nextBlock.order,
      updatedAt: nextBlock.updatedAt,
    });
    return nextBlock;
  });

  batch.update(getUserDocRef(uid), { updatedAt: baseTime });
  await batch.commit();
  return updated;
}
