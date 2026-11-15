"use client";

import { useEffect, useState } from "react";
import { BlockItem, ProfileData, UserProfile } from "@/types";
import { defaultProfileData } from "@/lib/mockData";
import {
  addLinkToFirestore,
  deleteLinkFromFirestore,
  fetchLinksFromFirestore,
  fetchUserProfileFromFirestore,
  reorderLinksInFirestore,
  updateLinkInFirestore,
  updateUserProfileInFirestore,
} from "@/lib/firestoreLinks";
import ProfileView from "@/components/ProfileView";
import { Loader2, AlertCircle } from "lucide-react";

export default function Home() {
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        const [links, storedProfile, githubRes] = await Promise.all([
          fetchLinksFromFirestore(),
          fetchUserProfileFromFirestore(),
          fetch("/api/github")
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null),
        ]);

        if (!active) return;

        setProfileData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            ...(storedProfile ?? {}),
            monthlyCommits:
              typeof githubRes?.commitsCount === "number" && githubRes.commitsCount > 0
                ? githubRes.commitsCount
                : prev.user.monthlyCommits,
            reposCount:
              typeof githubRes?.reposCount === "number" && githubRes.reposCount > 0
                ? githubRes.reposCount
                : prev.user.reposCount,
          },
          blocks: links,
        }));
      } catch (error) {
        console.error("초기 데이터 로드 실패:", error);
        if (active) {
          setErrorMsg("Firestore에서 데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();
    return () => {
      active = false;
    };
  }, []);

  const handleUpdateProfile = async (
    updates: Partial<Pick<UserProfile, "fullName" | "avatar" | "bio">>
  ) => {
    setErrorMsg(null);
    const previousUser = profileData.user;

    setProfileData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        ...updates,
      },
    }));

    try {
      await updateUserProfileInFirestore(updates);
    } catch (error) {
      console.error("Firestore 프로필 수정 실패:", error);
      setErrorMsg("프로필 저장 중 오류가 발생했습니다.");
      setProfileData((prev) => ({ ...prev, user: previousUser }));
    }
  };

  const handleAddBlock = async (newBlock: BlockItem) => {
    setErrorMsg(null);
    const blockWithTime: BlockItem = {
      ...newBlock,
      createdAt: newBlock.createdAt ?? Date.now(),
    };

    setProfileData((prev) => ({
      ...prev,
      blocks: [blockWithTime, ...prev.blocks],
    }));

    try {
      await addLinkToFirestore(blockWithTime);
      const refreshed = await fetchLinksFromFirestore();
      setProfileData((prev) => ({ ...prev, blocks: refreshed }));
    } catch (error) {
      console.error("Firestore 링크 추가 실패:", error);
      setErrorMsg("링크 저장 중 오류가 발생했습니다.");
      setProfileData((prev) => ({
        ...prev,
        blocks: prev.blocks.filter((b) => b.id !== blockWithTime.id),
      }));
    }
  };

  const handleUpdateBlock = async (updatedBlock: BlockItem) => {
    setErrorMsg(null);
    const previousBlocks = profileData.blocks;

    setProfileData((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)),
    }));

    try {
      await updateLinkInFirestore(updatedBlock);
    } catch (error) {
      console.error("Firestore 링크 수정 실패:", error);
      setErrorMsg("링크 수정 중 오류가 발생했습니다.");
      setProfileData((prev) => ({ ...prev, blocks: previousBlocks }));
    }
  };

  const handleDeleteBlock = async (id: string) => {
    setErrorMsg(null);
    const previousBlocks = profileData.blocks;

    setProfileData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== id),
    }));

    try {
      await deleteLinkFromFirestore(id);
    } catch (error) {
      console.error("Firestore 링크 삭제 실패:", error);
      setErrorMsg("링크 삭제 중 오류가 발생했습니다.");
      setProfileData((prev) => ({ ...prev, blocks: previousBlocks }));
    }
  };

  const handleReorderBlocks = async (reordered: BlockItem[]) => {
    setErrorMsg(null);
    const previousBlocks = profileData.blocks;

    setProfileData((prev) => ({
      ...prev,
      blocks: reordered,
    }));

    try {
      const updated = await reorderLinksInFirestore(reordered);
      setProfileData((prev) => ({ ...prev, blocks: updated }));
    } catch (error) {
      console.error("Firestore 링크 순서 변경 실패:", error);
      setErrorMsg("링크 순서 저장 중 오류가 발생했습니다.");
      setProfileData((prev) => ({ ...prev, blocks: previousBlocks }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotify-black flex items-center justify-center text-spotify-green font-mono text-sm">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-spotify-green" />
          <span>Firestore에서 데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {errorMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-950/90 border border-red-800 text-red-200 text-xs shadow-lg backdrop-blur-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}
      <ProfileView
        data={profileData}
        onAddBlock={handleAddBlock}
        onUpdateBlock={handleUpdateBlock}
        onDeleteBlock={handleDeleteBlock}
        onReorderBlocks={handleReorderBlocks}
        onUpdateProfile={handleUpdateProfile}
      />
    </>
  );
}
