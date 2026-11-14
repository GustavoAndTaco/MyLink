import { ProfileData } from "@/types";
import { defaultProfileData } from "./mockData";

export const STORAGE_KEY = "mylink_profile_data";

/**
 * 로컬 스토리지에서 프로필 데이터를 조회합니다.
 * 저장된 데이터가 없으면 기본 Mock 데이터를 로컬 스토리지에 저장하고 반환합니다.
 */
export function getStoredProfile(): ProfileData {
  if (typeof window === "undefined") {
    return defaultProfileData;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfileData));
      return defaultProfileData;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error("로컬 스토리지 읽기 실패:", error);
    return defaultProfileData;
  }
}

/**
 * 프로필 데이터를 로컬 스토리지에 저장합니다.
 */
export function saveStoredProfile(data: ProfileData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("로컬 스토리지 저장 실패:", error);
  }
}
