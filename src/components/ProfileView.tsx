"use client";

import { BlockItem, ProfileData, UserProfile } from "@/types";
import { useState } from "react";
import ProfileHeader from "./profile/ProfileHeader";
import LinkCard from "./profile/LinkCard";
import GitHubRepoCard from "./profile/GitHubRepoCard";
import TechStackCard from "./profile/TechStackCard";
import ProjectCard from "./profile/ProjectCard";
import AddLinkDialog from "./profile/AddLinkDialog";
import DeleteConfirmDialog from "./profile/DeleteConfirmDialog";
import SortableLinkWrapper from "./profile/SortableLinkWrapper";
import { Plus, Link2 } from "lucide-react";

interface ProfileViewProps {
  data: ProfileData;
  onAddBlock: (block: BlockItem) => void;
  onUpdateBlock: (block: BlockItem) => void;
  onDeleteBlock: (id: string) => void;
  onReorderBlocks: (blocks: BlockItem[]) => void;
  onUpdateProfile: (
    updates: Partial<Pick<UserProfile, "fullName" | "avatar" | "bio">>
  ) => void;
}

export default function ProfileView({
  data,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onReorderBlocks,
  onUpdateProfile,
}: ProfileViewProps) {
  const { user, theme, blocks, socialLinks } = data;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<BlockItem | null>(null);
  const [deletingBlock, setDeletingBlock] = useState<BlockItem | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const activeBlocks = blocks.filter((b) => b.isActive);

  const handleOpenAdd = () => {
    setEditingBlock(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (block: BlockItem) => {
    setEditingBlock(block);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBlock(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingBlock) return;
    onDeleteBlock(deletingBlock.id);
    setDeletingBlock(null);
  };

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...activeBlocks];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, moved);

    setDragIndex(null);
    setDragOverIndex(null);
    onReorderBlocks(updated);
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
    <div className={`w-full min-h-screen flex flex-col ${getThemeWrapper()} pb-16 select-none antialiased`}>
      {/* 1. 프로필 헤더 (이름, 사진, 소개글 인라인 편집 & GitHub 통계) */}
      <ProfileHeader
        user={user}
        socialLinks={socialLinks}
        theme={theme}
        onUpdateProfile={onUpdateProfile}
      />

      {/* 2. 링크 목록 컨테이너 */}
      <main className="flex-1 w-full max-w-xl mx-auto space-y-3.5 px-4 mt-6">
        {activeBlocks.length === 0 ? (
          <div className="p-10 text-center rounded-xl bg-spotify-surface border border-spotify-border text-spotify-subtext space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-400">
              <Link2 className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-zinc-300">
              아직 등록된 링크가 없습니다.
            </p>
            <p className="text-xs text-zinc-500">
              아래 버튼을 눌러 첫 번째 링크를 추가해보세요.
            </p>
          </div>
        ) : (
          activeBlocks.map((block, index) => (
            <SortableLinkWrapper
              key={block.id}
              id={block.id}
              index={index}
              isDragging={dragIndex === index}
              isDragOver={dragOverIndex === index}
              onDragStart={(idx) => setDragIndex(idx)}
              onDragEnter={(idx) => setDragOverIndex(idx)}
              onDragOver={() => {}}
              onDrop={handleDrop}
              onDragEnd={() => {
                setDragIndex(null);
                setDragOverIndex(null);
              }}
              onEdit={() => handleOpenEdit(block)}
              onDelete={() => setDeletingBlock(block)}
            >
              {renderBlockContent(block)}
            </SortableLinkWrapper>
          ))
        )}

        {/* 링크 추가 버튼 */}
        <button
          onClick={handleOpenAdd}
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

      {/* 3. 링크 추가 / 수정 다이얼로그 */}
      <AddLinkDialog
        isOpen={isDialogOpen}
        editingBlock={editingBlock}
        onClose={handleCloseDialog}
        onAdd={onAddBlock}
        onUpdate={onUpdateBlock}
      />

      {/* 4. 링크 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        isOpen={!!deletingBlock}
        targetTitle={deletingBlock?.title}
        onCancel={() => setDeletingBlock(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
