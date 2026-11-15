import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./Firebase";
import { BlockItem, UserProfile } from "@/types";
import { defaultProfileData } from "./mockData";

const USER_DOC_PATH = ["users", "anonymous"] as const;
const LINKS_COLLECTION_PATH = ["users", "anonymous", "links"] as const;

function getUserDocRef() {
  return doc(db, ...USER_DOC_PATH);
}

function getLinksCollection() {
  return collection(db, ...LINKS_COLLECTION_PATH);
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

/**
 * users/anonymous 문서에서 사용자 프로필 정보를 조회합니다.
 */
export async function fetchUserProfileFromFirestore(): Promise<UserProfile | null> {
  const userRef = getUserDocRef();
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    return null;
  }
  const data = snap.data();
  return (data?.user as UserProfile) ?? null;
}

/**
 * users/anonymous 문서의 사용자 프로필(이름, 아바타, 소개글 등)을 updateDoc으로 업데이트합니다.
 * 문서가 아직 없는 최초 상태일 경우 기본 프로필 문서를 생성합니다.
 */
export async function updateUserProfileInFirestore(
  updates: Partial<Pick<UserProfile, "fullName" | "avatar" | "bio" | "role">>
): Promise<void> {
  const userRef = getUserDocRef();
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      user: stripUndefined({
        ...defaultProfileData.user,
        ...updates,
      }),
      updatedAt: Date.now(),
    });
    return;
  }

  const patchPayload: Record<string, unknown> = {
    updatedAt: Date.now(),
  };
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      patchPayload[`user.${key}`] = value;
    }
  }
  await updateDoc(userRef, patchPayload);
}

/**
 * users/anonymous/links 컬렉션에서 링크 목록을 createdAt 기준 최신순(내림차순)으로 조회합니다.
 * 데이터가 없으면 빈 배열([])을 반환합니다.
 */
export async function fetchLinksFromFirestore(): Promise<BlockItem[]> {
  const linksRef = getLinksCollection();
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
 * 새 링크를 users/anonymous/links/{id} 문서로 저장합니다.
 */
export async function addLinkToFirestore(block: BlockItem): Promise<BlockItem> {
  const linksRef = getLinksCollection();
  const docRef = doc(linksRef, block.id);
  const payload: BlockItem = {
    ...block,
    createdAt: block.createdAt ?? Date.now(),
  };
  await setDoc(docRef, stripUndefined(payload));
  return payload;
}

/**
 * 기존 링크 문서를 updateDoc으로 수정합니다.
 */
export async function updateLinkInFirestore(block: BlockItem): Promise<BlockItem> {
  const linksRef = getLinksCollection();
  const docRef = doc(linksRef, block.id);

  const payload: Record<string, unknown> = {
    type: block.type,
    title: block.title,
    isActive: block.isActive,
    createdAt: block.createdAt ?? Date.now(),
    subtitle: block.subtitle ? block.subtitle : deleteField(),
    url: block.url ? block.url : deleteField(),
    icon: block.icon ? block.icon : deleteField(),
    badge: block.badge ? block.badge : deleteField(),
    pinnedRepo: block.pinnedRepo ? stripUndefined(block.pinnedRepo) : deleteField(),
    techStack: block.techStack ? block.techStack : deleteField(),
    project: block.project ? stripUndefined(block.project) : deleteField(),
  };

  await updateDoc(docRef, payload);
  return block;
}

/**
 * 링크 문서를 deleteDoc으로 삭제합니다.
 */
export async function deleteLinkFromFirestore(id: string): Promise<void> {
  const linksRef = getLinksCollection();
  const docRef = doc(linksRef, id);
  await deleteDoc(docRef);
}

/**
 * 드래그 앤 드롭으로 변경된 순서가 createdAt 기준 최신순 정렬에서도 유지되도록
 * 배열 순서대로 createdAt 및 order를 일괄 업데이트합니다.
 */
export async function reorderLinksInFirestore(blocks: BlockItem[]): Promise<BlockItem[]> {
  const linksRef = getLinksCollection();
  const batch = writeBatch(db);
  const baseTime = Date.now();

  const updated = blocks.map((block, index) => {
    const nextBlock: BlockItem = {
      ...block,
      createdAt: baseTime - index * 1000,
      order: index,
    };
    const docRef = doc(linksRef, block.id);
    batch.update(docRef, {
      createdAt: nextBlock.createdAt,
      order: nextBlock.order,
    });
    return nextBlock;
  });

  await batch.commit();
  return updated;
}
