import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./Firebase";
import { BlockItem } from "@/types";
import { defaultProfileData } from "./mockData";

const LINKS_COLLECTION_PATH = ["users", "anonymous", "links"] as const;
const SEEDED_FLAG_KEY = "mylink_firestore_seeded";

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
 * users/anonymous/links 컬렉션에서 링크 목록을 createdAt 기준 최신순(내림차순)으로 조회합니다.
 * 최초 방문(컬렉션 비어 있음 + 미시딩) 시 기본 Mock 데이터 10종을 시딩합니다.
 */
export async function fetchLinksFromFirestore(): Promise<BlockItem[]> {
  const linksRef = getLinksCollection();
  const q = query(linksRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    const alreadySeeded =
      typeof window !== "undefined" &&
      localStorage.getItem(SEEDED_FLAG_KEY) === "true";

    if (!alreadySeeded) {
      const seeded = await seedDefaultLinksToFirestore();
      if (typeof window !== "undefined") {
        localStorage.setItem(SEEDED_FLAG_KEY, "true");
      }
      return seeded;
    }

    return [];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(SEEDED_FLAG_KEY, "true");
  }

  return snapshot.docs.map((docSnap) => ({
    ...(docSnap.data() as BlockItem),
    id: docSnap.id,
  }));
}

/**
 * 기본 Mock 링크 10종을 createdAt 내림차순 정렬 시 기존 순서를 유지하도록 Firestore에 초기 시딩합니다.
 */
async function seedDefaultLinksToFirestore(): Promise<BlockItem[]> {
  const linksRef = getLinksCollection();
  const batch = writeBatch(db);
  const now = Date.now();
  const seededBlocks: BlockItem[] = defaultProfileData.blocks.map((block, index) => ({
    ...block,
    createdAt: now - index * 1000,
    order: index,
  }));

  for (const block of seededBlocks) {
    const docRef = doc(linksRef, block.id);
    batch.set(docRef, stripUndefined(block));
  }

  await batch.commit();
  return seededBlocks;
}

/**
 * 새 링크를 users/anonymous/links/{id} 문서로 저장합니다. (createdAt 현재 시각 부여)
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
 * 기존 링크 문서를 수정합니다.
 */
export async function updateLinkInFirestore(block: BlockItem): Promise<BlockItem> {
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
 * 링크 문서를 삭제합니다.
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
