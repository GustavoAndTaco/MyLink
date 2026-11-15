"use client";

import { BlockItem, ProfileData } from "@/types";
import { useState } from "react";
import ProfileHeader from "./profile/ProfileHeader";
import LinkCard from "./profile/LinkCard";
import GitHubRepoCard from "./profile/GitHubRepoCard";
import TechStackCard from "./profile/TechStackCard";
import ProjectCard from "./profile/ProjectCard";
import AddLinkDialog from "./profile/AddLinkDialog";
import { Plus } from "lucide-react";

interface ProfileViewProps {
  data: ProfileData;
  onDataChange?: (data: ProfileData) => void;
}

export default function ProfileView({ data, onDataChange }: ProfileViewProps) {
  const { user, theme, blocks, socialLinks } = data;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeBlocks = blocks.filter((b) => b.isActive);

  const handleAddBlock = (newBlock: BlockItem) => {
    if (!onDataChange) return;
    onDataChange({ ...data, blocks: [...data.blocks, newBlock] });
  };

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
    <div className={`w-full min-h-screen flex flex-col ${getThemeWrapper()} pb-16 select-none antialiased`}>
      {/* 1. 프로필 헤더 */}
      <ProfileHeader
        user={user}
        socialLinks={socialLinks}
        theme={theme}
      />

      {/* 2. 링크 목록 컨테이너 */}
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

        {/* 링크 추가 버튼 */}
        <button
          onClick={() => setIsDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-dashed border-zinc-700 hover:border-spotify-green/50 text-spotify-subtext hover:text-spotify-green transition-all duration-200 text-sm font-medium group"
          aria-label="링크 추가"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>링크 추가하기</span>
        </button>

        {/* 푸터 */}
        <footer className="pt-6 pb-6 text-center text-xs text-spotify-subtext space-y-2">
          <p>© 2026 {user.fullName || user.username} • Powered by MyLink</p>
          <div className="flex justify-center gap-4 text-xs">
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-white hover:underline transition-colors">
                GitHub
              </a>
            )}
            {socialLinks.blog && (
              <a href={socialLinks.blog} target="_blank" rel="noreferrer" className="hover:text-white hover:underline transition-colors">
                Blog
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-white hover:underline transition-colors">
                LinkedIn
              </a>
            )}
          </div>
        </footer>
      </main>

      {/* 3. 링크 추가 다이얼로그 */}
      <AddLinkDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleAddBlock}
      />
    </div>
  );
}
