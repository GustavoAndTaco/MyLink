"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchPublicUserByDisplayName,
  type PublicProfileResult,
} from "@/lib/firestoreLinks";
import { BlockItem } from "@/types";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ProfileHeader from "@/components/profile/ProfileHeader";
import LinkCard from "@/components/profile/LinkCard";
import GitHubRepoCard from "@/components/profile/GitHubRepoCard";
import TechStackCard from "@/components/profile/TechStackCard";
import ProjectCard from "@/components/profile/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { Home, Link2 } from "lucide-react";

interface PublicProfileClientProps {
  params: Promise<{ displayName: string }>;
}

export default function PublicProfileClient({ params }: PublicProfileClientProps) {
  const { displayName: rawDisplayName } = use(params);
  const decodedDisplayName = decodeURIComponent(rawDisplayName);

  const [profile, setProfile] = useState<PublicProfileResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPublicProfile() {
      setIsLoading(true);
      setIsNotFound(false);

      try {
        const [result, githubRes] = await Promise.all([
          fetchPublicUserByDisplayName(decodedDisplayName),
          fetch("/api/github")
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null),
        ]);

        if (!active) return;

        if (!result) {
          setIsNotFound(true);
          return;
        }

        setProfile({
          ...result,
          userProfile: {
            ...result.userProfile,
            monthlyCommits:
              typeof githubRes?.commitsCount === "number" && githubRes.commitsCount > 0
                ? githubRes.commitsCount
                : result.userProfile.monthlyCommits,
            reposCount:
              typeof githubRes?.reposCount === "number" && githubRes.reposCount > 0
                ? githubRes.reposCount
                : result.userProfile.reposCount,
          },
        });
      } catch (error) {
        console.error("공개 프로필 로드 실패:", error);
        if (active) {
          setIsNotFound(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadPublicProfile();
    return () => {
      active = false;
    };
  }, [decodedDisplayName]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isNotFound || !profile) {
    notFound();
  }

  const activeBlocks = profile.links.filter((b) => b.isActive);

  const renderBlockContent = (block: BlockItem) => {
    switch (block.type) {
      case "link":
        return <LinkCard block={block} />;
      case "github_repo":
        return <GitHubRepoCard block={block} />;
      case "tech_stack":
        return <TechStackCard block={block} />;
      case "project":
        return <ProjectCard block={block} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-spotify-black text-white pb-16 antialiased">
      {/* 공개 프로필 상단 네비게이션 */}
      <nav className="sticky top-0 z-40 w-full border-b border-spotify-border bg-spotify-black/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-spotify-green text-black shadow-md">
              <Link2 className="h-4 w-4 stroke-[2.5]" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              MyLink
            </span>
            <Badge variant="outline" className="text-[11px]">
              @{profile.displayName}
            </Badge>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1f1f1f] px-4 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-spotify-elevated hover:text-white transition-colors"
          >
            <Home className="h-3.5 w-3.5 text-spotify-green" />
            <span>내 링크 관리</span>
          </Link>
        </div>
      </nav>

      {/* 읽기 전용 프로필 헤더 */}
      <ProfileHeader
        user={profile.userProfile}
        socialLinks={profile.socialLinks}
        theme="spotify-dark"
        isPreviewMode={true}
        onUpdateProfile={() => {}}
      />

      {/* 공개 링크 목록 */}
      <main className="flex-1 w-full max-w-xl mx-auto space-y-3.5 px-4 mt-6">
        {activeBlocks.length === 0 ? (
          <div className="p-10 text-center rounded-xl bg-spotify-surface border border-spotify-border text-spotify-subtext space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-400">
              <Link2 className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-zinc-300">
              아직 공개된 링크가 없습니다.
            </p>
          </div>
        ) : (
          activeBlocks.map((block) => (
            <div key={block.id}>{renderBlockContent(block)}</div>
          ))
        )}

        <footer className="pt-6 pb-6 text-center text-xs text-spotify-subtext">
          <p>© 2026 {profile.userProfile.fullName || profile.displayName} • Powered by MyLink</p>
        </footer>
      </main>
    </div>
  );
}
