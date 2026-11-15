"use client";

import { useState } from "react";
import { SocialLinks, UserProfile } from "@/types";
import { Check, UserPen, X } from "lucide-react";

interface ProfileEditDialogProps {
  isOpen: boolean;
  user: UserProfile;
  socialLinks: SocialLinks;
  onClose: () => void;
  onSave: (
    userUpdates: Partial<Pick<UserProfile, "fullName" | "avatar" | "bio" | "role">>,
    socialUpdates: SocialLinks
  ) => Promise<void> | void;
}

const AVATAR_PRESETS = ["👨‍💻", "👩‍💻", "🚀", "⚡", "🎧", "🌮"];

export default function ProfileEditDialog({
  isOpen,
  user,
  socialLinks,
  onClose,
  onSave,
}: ProfileEditDialogProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [role, setRole] = useState(user.role);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);
  const [github, setGithub] = useState(socialLinks.github ?? "");
  const [blog, setBlog] = useState(socialLinks.blog ?? "");
  const [linkedin, setLinkedin] = useState(socialLinks.linkedin ?? "");
  const [email, setEmail] = useState(socialLinks.email ?? "");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(
        {
          fullName: fullName.trim() || user.fullName,
          role: role.trim() || user.role,
          bio: bio.trim(),
          avatar: avatar.trim() || "👨‍💻",
        },
        {
          github: github.trim(),
          blog: blog.trim(),
          linkedin: linkedin.trim(),
          email: email.trim(),
        }
      );
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="프로필 편집"
    >
      <div className="w-full max-w-lg rounded-2xl border border-spotify-border bg-spotify-surface shadow-[0_8px_24px_rgba(0,0,0,0.65)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-spotify-border px-5 py-4">
          <div className="flex items-center gap-2">
            <UserPen className="h-4 w-4 text-spotify-green" />
            <h2 className="text-base font-bold text-white">프로필 편집</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto p-5 space-y-4">
          {/* 이름 & 직무 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">표시 이름</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={50}
                placeholder="예: Gustavo"
                className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-3 py-2 text-xs text-white outline-none focus:border-spotify-green"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">직무 / 역할</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                maxLength={60}
                placeholder="예: Full-Stack Developer"
                className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-3 py-2 text-xs text-white outline-none focus:border-spotify-green"
              />
            </div>
          </div>

          {/* 아바타 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                프로필 사진 (이모지 또는 이미지 URL)
              </label>
              <div className="flex items-center gap-1">
                {AVATAR_PRESETS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`h-6 w-6 rounded-md text-sm flex items-center justify-center hover:bg-zinc-700 transition-colors cursor-pointer ${
                      avatar === emoji ? "bg-spotify-green/20 ring-1 ring-spotify-green" : ""
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://... 또는 이모지"
              className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-3 py-2 text-xs text-white outline-none focus:border-spotify-green"
            />
          </div>

          {/* 한 줄 소개 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">한 줄 소개</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="개발과 일상을 기록하는 나만의 링크 허브입니다."
              className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-3 py-2 text-xs text-white outline-none focus:border-spotify-green resize-none leading-relaxed"
            />
          </div>

          {/* 소셜 링크 */}
          <div className="pt-2 border-t border-spotify-border space-y-3">
            <p className="text-xs font-bold text-spotify-green uppercase tracking-wider">
              소셜 링크 설정
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-400">GitHub URL</label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-3 py-2 text-xs text-white outline-none focus:border-spotify-green"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-400">기술 블로그 URL</label>
                <input
                  type="url"
                  value={blog}
                  onChange={(e) => setBlog(e.target.value)}
                  placeholder="https://velog.io/@username"
                  className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-3 py-2 text-xs text-white outline-none focus:border-spotify-green"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-400">LinkedIn URL</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-3 py-2 text-xs text-white outline-none focus:border-spotify-green"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-400">Contact 이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full rounded-lg border border-zinc-700 bg-[#121212] px-3 py-2 text-xs text-white outline-none focus:border-spotify-green"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-spotify-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-full bg-spotify-green px-5 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-spotify-green-hover transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{isSaving ? "저장 중..." : "저장하기"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
