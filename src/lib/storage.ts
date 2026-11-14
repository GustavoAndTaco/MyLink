import { ProfileData } from "@/types";
import { initialProfileData } from "./mockData";

const STORAGE_KEY = "mylink_profile_data";
const AUTH_KEY = "mylink_mock_auth";

export function getProfileData(): ProfileData {
  if (typeof window === "undefined") {
    return initialProfileData;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProfileData));
      return initialProfileData;
    }
    return JSON.parse(stored);
  } catch (err) {
    console.error("Failed to read from localStorage", err);
    return initialProfileData;
  }
}

export function saveProfileData(data: ProfileData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("mylink_storage_update"));
  } catch (err) {
    console.error("Failed to save to localStorage", err);
  }
}

export function resetProfileData(): ProfileData {
  if (typeof window === "undefined") return initialProfileData;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProfileData));
    window.dispatchEvent(new Event("mylink_storage_update"));
    return initialProfileData;
  } catch (err) {
    console.error("Failed to reset localStorage", err);
    return initialProfileData;
  }
}

export function incrementBlockClick(blockId: string): void {
  const current = getProfileData();
  const updatedBlocks = current.blocks.map((b) =>
    b.id === blockId ? { ...b, clicks: (b.clicks || 0) + 1 } : b
  );
  saveProfileData({ ...current, blocks: updatedBlocks });
}

export function incrementPageView(): void {
  const current = getProfileData();
  saveProfileData({ ...current, pageViews: (current.pageViews || 0) + 1 });
}

export function getMockAuth(): { isLoggedIn: boolean; username: string } {
  if (typeof window === "undefined") {
    return { isLoggedIn: true, username: "developer" };
  }
  try {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) {
      const defaultAuth = { isLoggedIn: true, username: "developer" };
      localStorage.setItem(AUTH_KEY, JSON.stringify(defaultAuth));
      return defaultAuth;
    }
    return JSON.parse(auth);
  } catch {
    return { isLoggedIn: true, username: "developer" };
  }
}

export function setMockAuth(isLoggedIn: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ isLoggedIn, username: "developer" })
  );
  window.dispatchEvent(new Event("mylink_auth_update"));
}
