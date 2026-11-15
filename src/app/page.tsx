"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/Firebase";
import { BlockItem, ProfileData, UserAccountInfo, UserProfile } from "@/types";
import { defaultProfileData } from "@/lib/mockData";
import {
  addLinkToFirestore,
  deleteLinkFromFirestore,
  ensureUserDocInFirestore,
  fetchLinksFromFirestore,
  reorderLinksInFirestore,
  updateLinkInFirestore,
  updateUserProfileInFirestore,
} from "@/lib/firestoreLinks";
import TopNavHeader from "@/components/TopNavHeader";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import LoggedOutView from "@/components/LoggedOutView";
import ProfileView from "@/components/ProfileView";
import { useAppToast } from "@/components/ui/toast";

export default function Home() {
  const toast = useAppToast();
  const [account, setAccount] = useState<UserAccountInfo | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!active) return;

      if (!firebaseUser) {
        setAccount(null);
        setProfileData(defaultProfileData);
        setIsPreviewMode(false);
        setIsAuthLoading(false);
        setIsDataLoading(false);
        return;
      }

      setIsDataLoading(true);
      try {
        const [{ userProfile, accountInfo }, links, githubRes] = await Promise.all([
          ensureUserDocInFirestore({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }),
          fetchLinksFromFirestore(firebaseUser.uid),
          fetch("/api/github")
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null),
        ]);

        if (!active) return;

        setAccount(accountInfo);
        setProfileData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            ...userProfile,
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
        console.error("사용자 데이터 로드 실패:", error);
        if (active) {
          toast.error(
            "데이터를 불러오지 못했습니다",
            "Firestore 연결 및 권한을 확인해주세요."
          );
        }
      } finally {
        if (active) {
          setIsAuthLoading(false);
          setIsDataLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [toast]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const emailPrefix = result.user.email?.split("@")[0] || "developer";
      toast.success("로그인되었습니다", `${emailPrefix}님, 환영합니다!`);
    } catch (error) {
      console.error("Google 로그인 실패:", error);
      toast.error("로그인에 실패했습니다", "잠시 후 다시 시도해주세요.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("로그아웃되었습니다", "다시 이용하려면 Google 계정으로 로그인하세요.");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      toast.error("로그아웃 중 오류가 발생했습니다");
    }
  };

  const handleTogglePreview = () => {
    setIsPreviewMode((prev) => {
      const next = !prev;
      if (next) {
        toast.info(
          "방문자 미리보기 모드",
          "편집 버튼이 숨겨지고 방문자 화면으로 표시됩니다."
        );
      } else {
        toast.info("편집 모드로 전환되었습니다", "링크와 프로필을 자유롭게 수정하세요.");
      }
      return next;
    });
  };

  const handleToggleSummary = () => {
    setIsSummaryOpen((prev) => {
      const next = !prev;
      toast.info(next ? "계정 요약 표시" : "계정 요약 숨김");
      return next;
    });
  };

  const handleUpdateProfile = async (
    updates: Partial<Pick<UserProfile, "fullName" | "avatar" | "bio">>
  ) => {
    if (!account) return;
    const previousUser = profileData.user;

    setProfileData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        ...updates,
      },
    }));

    try {
      const updatedAt = await updateUserProfileInFirestore(account.uid, updates);
      setAccount((prev) => (prev ? { ...prev, updatedAt } : prev));
      toast.success("프로필이 저장되었습니다");
    } catch (error) {
      console.error("Firestore 프로필 수정 실패:", error);
      setProfileData((prev) => ({ ...prev, user: previousUser }));
      toast.error("프로필 저장 중 오류가 발생했습니다");
    }
  };

  const handleAddBlock = async (newBlock: BlockItem) => {
    if (!account) return;
    const now = Date.now();
    const blockWithTime: BlockItem = {
      ...newBlock,
      createdAt: newBlock.createdAt ?? now,
      updatedAt: now,
    };

    setProfileData((prev) => ({
      ...prev,
      blocks: [blockWithTime, ...prev.blocks],
    }));

    try {
      await addLinkToFirestore(account.uid, blockWithTime);
      const refreshed = await fetchLinksFromFirestore(account.uid);
      setProfileData((prev) => ({ ...prev, blocks: refreshed }));
      setAccount((prev) => (prev ? { ...prev, updatedAt: Date.now() } : prev));
      toast.success("새 링크가 추가되었습니다", blockWithTime.title);
    } catch (error) {
      console.error("Firestore 링크 추가 실패:", error);
      setProfileData((prev) => ({
        ...prev,
        blocks: prev.blocks.filter((b) => b.id !== blockWithTime.id),
      }));
      toast.error("링크 저장 중 오류가 발생했습니다");
    }
  };

  const handleUpdateBlock = async (updatedBlock: BlockItem) => {
    if (!account) return;
    const previousBlocks = profileData.blocks;

    setProfileData((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)),
    }));

    try {
      const saved = await updateLinkInFirestore(account.uid, updatedBlock);
      setProfileData((prev) => ({
        ...prev,
        blocks: prev.blocks.map((b) => (b.id === saved.id ? saved : b)),
      }));
      setAccount((prev) => (prev ? { ...prev, updatedAt: saved.updatedAt } : prev));
      toast.success("링크가 수정되었습니다", saved.title);
    } catch (error) {
      console.error("Firestore 링크 수정 실패:", error);
      setProfileData((prev) => ({ ...prev, blocks: previousBlocks }));
      toast.error("링크 수정 중 오류가 발생했습니다");
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (!account) return;
    const previousBlocks = profileData.blocks;

    setProfileData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== id),
    }));

    try {
      await deleteLinkFromFirestore(account.uid, id);
      setAccount((prev) => (prev ? { ...prev, updatedAt: Date.now() } : prev));
      toast.info("링크가 삭제되었습니다");
    } catch (error) {
      console.error("Firestore 링크 삭제 실패:", error);
      setProfileData((prev) => ({ ...prev, blocks: previousBlocks }));
      toast.error("링크 삭제 중 오류가 발생했습니다");
    }
  };

  const handleReorderBlocks = async (reordered: BlockItem[]) => {
    if (!account) return;
    const previousBlocks = profileData.blocks;

    setProfileData((prev) => ({
      ...prev,
      blocks: reordered,
    }));

    try {
      const updated = await reorderLinksInFirestore(account.uid, reordered);
      setProfileData((prev) => ({ ...prev, blocks: updated }));
      setAccount((prev) => (prev ? { ...prev, updatedAt: Date.now() } : prev));
      toast.success("링크 순서가 저장되었습니다");
    } catch (error) {
      console.error("Firestore 링크 순서 변경 실패:", error);
      setProfileData((prev) => ({ ...prev, blocks: previousBlocks }));
      toast.error("링크 순서 저장 중 오류가 발생했습니다");
    }
  };

  if (isAuthLoading || isDataLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-spotify-black text-white">
      <TopNavHeader
        account={account}
        isAuthLoading={isAuthLoading}
        isPreviewMode={isPreviewMode}
        isSummaryOpen={isSummaryOpen}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onTogglePreview={handleTogglePreview}
        onToggleSummary={handleToggleSummary}
      />

      {!account ? (
        <LoggedOutView onLogin={handleGoogleLogin} />
      ) : (
        <ProfileView
          data={profileData}
          account={account}
          isPreviewMode={isPreviewMode}
          isSummaryOpen={isSummaryOpen}
          onTogglePreview={handleTogglePreview}
          onAddBlock={handleAddBlock}
          onUpdateBlock={handleUpdateBlock}
          onDeleteBlock={handleDeleteBlock}
          onReorderBlocks={handleReorderBlocks}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}
