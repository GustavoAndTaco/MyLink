"use client";

import { ProfileData } from "@/types";
import { useState } from "react";
import ProfileHeader from "./profile/ProfileHeader";
import LinkCard from "./profile/LinkCard";
import GitHubRepoCard from "./profile/GitHubRepoCard";
import TechStackCard from "./profile/TechStackCard";
import ProjectCard from "./profile/ProjectCard";
import NowPlayingBar from "./profile/NowPlayingBar";

interface ProfileViewProps {
  data: ProfileData;
}

export default function ProfileView({ data }: ProfileViewProps) {
  const { user, theme, blocks, socialLinks } = data;
  const [isPlaying, setIsPlaying] = useState(true);

  const activeBlocks = blocks.filter((b) => b.isActive);

  // 테마별 루트 래퍼 스타일 (Tailwind CSS 클래스 기반)
  const getThemeWrapper = () => {
    switch (theme) {
      case "github-dark":
        return "bg-[#0d1117] text-[#c9d1d9] font-sans";
      case "monokai":
        return "bg-[#272822] text-[#f8f8f2] font-mono";
      case "minimal-light":
        return "bg-zinc-50 text-zinc-900 font-sans";
      case "spotify-dark":
      default:
        return "bg-spotify-black text-white font-sans";
    }
  };

  return (
    <div className={`w-full min-h-screen flex flex-col ${getThemeWrapper()} pb-28 select-none antialiased`}>
      {/* 1. 프로필 헤더 (Hero 영역) */}
      <ProfileHeader
        user={user}
        socialLinks={socialLinks}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        theme={theme}
      />

      {/* 2. 링크 목록 컨테이너 (Main Block List) */}
      <main className="flex-1 w-full max-w-xl mx-auto space-y-3.5 px-4 mt-6">
        {activeBlocks.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-spotify-surface border border-spotify-border text-spotify-subtext text-sm">
            등록된 링크가 없습니다.
          </div>
        ) : (
          activeBlocks.map((block) => {
            switch (block.type) {
              case "link":
                return <LinkCard key={block.id} block={block} />;
              case "github_repo":
                return <GitHubRepoCard key={block.id} block={block} />;
              case "tech_stack":
                return <TechStackCard key={block.id} block={block} />;
              case "project":
                return <ProjectCard key={block.id} block={block} />;
              default:
                return null;
            }
          })
        )}

        {/* 푸터 영역 */}
        <footer className="pt-8 pb-6 text-center text-xs text-spotify-subtext space-y-2">
          <p>© 2026 {user.fullName || user.username} • Powered by MyLink</p>
          <div className="flex justify-center gap-4 text-xs">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white hover:underline transition-colors"
              >
                GitHub
              </a>
            )}
            {socialLinks.blog && (
              <a
                href={socialLinks.blog}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white hover:underline transition-colors"
              >
                Blog
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white hover:underline transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        </footer>
      </main>

      {/* 3. 하단 Spotify 시그니처 Now Playing 바 */}
      {theme === "spotify-dark" && (
        <NowPlayingBar
          role={user.role}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
        />
      )}
    </div>
  );
}
