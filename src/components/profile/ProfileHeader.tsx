"use client";

import { useState, useEffect } from "react";
import { ProfileData, UserProfile } from "@/types";
import {
  CheckCircle2,
  Mail,
  Globe,
  Radio,
  Pencil,
  Check,
  X,
  Camera,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";

interface ProfileHeaderProps {
  user: ProfileData["user"];
  socialLinks: ProfileData["socialLinks"];
  theme: ProfileData["theme"];
  onUpdateProfile: (
    updates: Partial<Pick<UserProfile, "fullName" | "avatar" | "bio">>
  ) => void;
}

const AVATAR_PRESETS = ["👨‍💻", "👩‍💻", "🚀", "⚡", "🎧", "🌮"];

function isImageUrl(value: string) {
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:image/")
  );
}

export default function ProfileHeader({
  user,
  socialLinks,
  theme,
  onUpdateProfile,
}: ProfileHeaderProps) {
  const [editingField, setEditingField] = useState<"avatar" | "fullName" | "bio" | null>(
    null
  );
  const [draftAvatar, setDraftAvatar] = useState(user.avatar);
  const [draftName, setDraftName] = useState(user.fullName);
  const [draftBio, setDraftBio] = useState(user.bio);

  useEffect(() => {
    setDraftAvatar(user.avatar);
    setDraftName(user.fullName);
    setDraftBio(user.bio);
  }, [user.avatar, user.fullName, user.bio]);

  const handleSaveAvatar = () => {
    const trimmed = draftAvatar.trim();
    if (trimmed && trimmed !== user.avatar) {
      onUpdateProfile({ avatar: trimmed });
    }
    setEditingField(null);
  };

  const handleSaveName = () => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== user.fullName) {
      onUpdateProfile({ fullName: trimmed });
    }
    setEditingField(null);
  };

  const handleSaveBio = () => {
    const trimmed = draftBio.trim();
    if (trimmed !== user.bio) {
      onUpdateProfile({ bio: trimmed });
    }
    setEditingField(null);
  };

  const handleCancel = () => {
    setDraftAvatar(user.avatar);
    setDraftName(user.fullName);
    setDraftBio(user.bio);
    setEditingField(null);
  };

  const getHeaderStyle = () => {
    switch (theme) {
      case "github-dark":
        return {
          glow: "bg-gradient-to-b from-[#161b22] to-[#0d1117]",
          pillBtn: "border border-zinc-700 hover:border-zinc-500 text-zinc-300",
          highlight: "text-blue-400",
          subtext: "text-zinc-400",
          border: "border-zinc-800",
        };
      case "monokai":
        return {
          glow: "bg-gradient-to-b from-[#3e3d32] to-[#272822]",
          pillBtn: "border border-[#f92672] text-[#f92672] hover:bg-[#f92672] hover:text-white",
          highlight: "text-[#66d9ef]",
          subtext: "text-zinc-400",
          border: "border-[#49483e]",
        };
      case "minimal-light":
        return {
          glow: "bg-gradient-to-b from-white to-zinc-50",
          pillBtn: "border border-zinc-300 hover:border-zinc-700 text-zinc-800",
          highlight: "text-blue-600",
          subtext: "text-zinc-600",
          border: "border-zinc-200",
        };
      case "spotify-dark":
      default:
        return {
          glow: "bg-gradient-to-b from-[#253828] via-[#162218] to-spotify-black",
          pillBtn:
            "border border-spotify-pill-border hover:border-white text-white hover:bg-white/5",
          highlight: "text-spotify-green",
          subtext: "text-spotify-subtext",
          border: "border-spotify-border",
        };
    }
  };

  const st = getHeaderStyle();

  return (
    <header className={`w-full ${st.glow} pt-12 pb-8 px-6 sm:px-8 border-b ${st.border}`}>
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-4">
        {/* 아바타 & 인라인 편집 */}
        <div className="relative group">
          <button
            type="button"
            onClick={() =>
              setEditingField(editingField === "avatar" ? null : "avatar")
            }
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden flex items-center justify-center bg-zinc-800/80 border-2 border-spotify-green/70 text-5xl shadow-2xl transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            title="클릭하여 프로필 사진 수정"
            aria-label="프로필 사진 수정"
          >
            {isImageUrl(user.avatar) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.fullName || user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user.avatar || "👨‍💻"}</span>
            )}
            <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
              <Camera className="w-5 h-5" />
              <span className="text-[10px] font-semibold">사진 변경</span>
            </span>
          </button>

          {user.verified && (
            <span
              className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-spotify-black ring-2 ring-spotify-black pointer-events-none"
              title="Verified Developer"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-spotify-green opacity-60"></span>
              <CheckCircle2 className="relative w-5 h-5 text-spotify-green fill-spotify-black" />
            </span>
          )}
        </div>

        {/* 아바타 인라인 편집 패널 */}
        {editingField === "avatar" && (
          <div className="w-full max-w-sm bg-zinc-900/95 border border-zinc-700 rounded-xl p-3 space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>이모지 또는 이미지 URL 입력</span>
              <div className="flex items-center gap-1">
                {AVATAR_PRESETS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setDraftAvatar(emoji)}
                    className={`w-6 h-6 rounded-md text-sm flex items-center justify-center hover:bg-zinc-700 transition-colors ${
                      draftAvatar === emoji ? "bg-spotify-green/20 ring-1 ring-spotify-green" : ""
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={draftAvatar}
                onChange={(e) => setDraftAvatar(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveAvatar();
                  if (e.key === "Escape") handleCancel();
                }}
                placeholder="https://... 또는 이모지"
                autoFocus
                className="flex-1 bg-zinc-950 border border-zinc-700 focus:border-spotify-green rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
              />
              <button
                type="button"
                onClick={handleSaveAvatar}
                className="p-1.5 rounded-lg bg-spotify-green hover:bg-spotify-green-hover text-black transition-colors"
                aria-label="사진 저장"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                aria-label="취소"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 사용자 정보: 핸들, 이름(인라인 편집), 역할 */}
        <div className="space-y-1 w-full max-w-md">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide">
            <span className={st.highlight}>
              {user.verified ? "✓ Verified Developer" : `@${user.username}`}
            </span>
          </div>

          {editingField === "fullName" ? (
            <div className="flex items-center justify-center gap-1.5 pt-0.5">
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") handleCancel();
                }}
                autoFocus
                maxLength={50}
                className="bg-zinc-900 border border-spotify-green/70 rounded-lg px-3 py-1 text-xl sm:text-2xl font-bold text-white text-center outline-none w-64"
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="p-1.5 rounded-lg bg-spotify-green hover:bg-spotify-green-hover text-black transition-colors"
                aria-label="이름 저장"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                aria-label="취소"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="group/name relative inline-flex items-center justify-center">
              <h1
                onClick={() => setEditingField("fullName")}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight cursor-pointer hover:text-spotify-green transition-colors text-center"
                title="클릭하여 이름 수정"
              >
                {user.fullName || user.role}
              </h1>
              <button
                type="button"
                onClick={() => setEditingField("fullName")}
                className="absolute -right-7 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-500 hover:text-spotify-green opacity-60 sm:opacity-0 sm:group-hover/name:opacity-100 transition-all"
                title="이름 수정"
                aria-label="이름 수정"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <p className={`text-xs sm:text-sm ${st.subtext} font-medium`}>{user.role}</p>
        </div>

        {/* 한 줄 소개 (Bio) 인라인 편집 */}
        <div className="w-full max-w-lg">
          {editingField === "bio" ? (
            <div className="space-y-2">
              <textarea
                value={draftBio}
                onChange={(e) => setDraftBio(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") handleCancel();
                }}
                rows={3}
                maxLength={200}
                autoFocus
                className="w-full bg-zinc-900 border border-spotify-green/70 rounded-xl px-3 py-2 text-xs sm:text-sm text-white outline-none resize-none leading-relaxed"
              />
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1 rounded-full text-xs text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>취소</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveBio}
                  className="px-3 py-1 rounded-full text-xs font-bold text-black bg-spotify-green hover:bg-spotify-green-hover transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>저장</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setEditingField("bio")}
              className="group/bio relative inline-block cursor-pointer rounded-lg px-3 py-1 hover:bg-white/5 transition-colors text-center"
              title="클릭하여 소개글 수정"
            >
              <p className={`leading-relaxed text-xs sm:text-sm ${st.subtext} text-center`}>
                {user.bio || "소개글을 입력해보세요."}
              </p>
              <Pencil className="w-3 h-3 text-zinc-500 group-hover/bio:text-spotify-green absolute -right-4 top-2 opacity-60 sm:opacity-0 sm:group-hover/bio:opacity-100 transition-all" />
            </div>
          )}
        </div>

        {/* 개발자 주요 지표 통계 (GitHub MyLink 실시간 연동) */}
        <div className={`flex flex-wrap items-center justify-center gap-3 pt-1 text-xs ${st.subtext}`}>
          <a
            href="https://github.com/GustavoAndTaco/MyLink/commits"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-spotify-green transition-colors"
            title="GitHub MyLink 커밋 내역 보기"
          >
            <strong className="text-white font-semibold">{user.monthlyCommits}</strong> Commits
          </a>
          <span className="text-zinc-600">•</span>
          <a
            href="https://github.com/GustavoAndTaco?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-spotify-green transition-colors"
            title="GitHub 레포지토리 보기"
          >
            <strong className="text-white font-semibold">{user.reposCount}</strong> Repos
          </a>
          <span className="text-zinc-600">•</span>
          <span className={`flex items-center gap-1.5 ${st.highlight}`}>
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <strong className="font-semibold">{user.uptime}</strong> Uptime
          </span>
        </div>

        {/* Contact 버튼 */}
        <div className="flex items-center justify-center pt-2">
          <a
            href={`mailto:${socialLinks.email || "developer@example.com"}`}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 ${st.pillBtn}`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </a>
        </div>

        {/* 소셜 링크 바 */}
        <div className="flex items-center justify-center gap-4 pt-1">
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors duration-150 p-1.5 rounded-full hover:bg-white/5"
              title="GitHub"
              aria-label="GitHub 프로필"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {socialLinks.blog && (
            <a
              href={socialLinks.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors duration-150 p-1.5 rounded-full hover:bg-white/5"
              title="Tech Blog"
              aria-label="기술 블로그"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors duration-150 p-1.5 rounded-full hover:bg-white/5"
              title="LinkedIn"
              aria-label="LinkedIn 프로필"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
