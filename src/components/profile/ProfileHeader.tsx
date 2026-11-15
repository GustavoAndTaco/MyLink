"use client";

import { ProfileData } from "@/types";
import { CheckCircle2, Play, Pause, Mail, Globe, Radio } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";

interface ProfileHeaderProps {
  user: ProfileData["user"];
  socialLinks: ProfileData["socialLinks"];
  isPlaying: boolean;
  onTogglePlay: () => void;
  theme: ProfileData["theme"];
}

export default function ProfileHeader({
  user,
  socialLinks,
  isPlaying,
  onTogglePlay,
  theme,
}: ProfileHeaderProps) {
  // 테마별 헤더 배경 및 액센트 스타일 (Tailwind CSS 클래스)
  const getHeaderStyle = () => {
    switch (theme) {
      case "github-dark":
        return {
          glow: "bg-gradient-to-b from-[#161b22] to-[#0d1117]",
          accentBtn: "bg-[#238636] hover:bg-[#2ea043] text-white",
          pillBtn: "border border-zinc-700 hover:border-zinc-500 text-zinc-300",
          highlight: "text-blue-400",
          subtext: "text-zinc-400",
          border: "border-zinc-800",
        };
      case "monokai":
        return {
          glow: "bg-gradient-to-b from-[#3e3d32] to-[#272822]",
          accentBtn: "bg-[#a6e22e] hover:bg-[#bbf444] text-[#272822]",
          pillBtn: "border border-[#f92672] text-[#f92672] hover:bg-[#f92672] hover:text-white",
          highlight: "text-[#66d9ef]",
          subtext: "text-zinc-400",
          border: "border-[#49483e]",
        };
      case "minimal-light":
        return {
          glow: "bg-gradient-to-b from-white to-zinc-50",
          accentBtn: "bg-zinc-900 hover:bg-black text-white",
          pillBtn: "border border-zinc-300 hover:border-zinc-700 text-zinc-800",
          highlight: "text-blue-600",
          subtext: "text-zinc-600",
          border: "border-zinc-200",
        };
      case "spotify-dark":
      default:
        return {
          glow: "bg-gradient-to-b from-[#253828] via-[#162218] to-spotify-black",
          accentBtn: "bg-spotify-green hover:bg-spotify-green-hover text-black shadow-lg shadow-spotify-green/20",
          pillBtn: "border border-spotify-pill-border hover:border-white text-white hover:bg-white/5",
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
        {/* 아바타 & Verified 뱃지 */}
        <div className="relative group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden flex items-center justify-center bg-zinc-800/80 border-2 border-spotify-green/70 text-5xl shadow-2xl transition-transform duration-300 group-hover:scale-105">
            {user.avatar}
          </div>
          {user.verified && (
            <span
              className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-spotify-black ring-2 ring-spotify-black"
              title="Verified Developer"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-spotify-green opacity-60"></span>
              <CheckCircle2 className="relative w-5 h-5 text-spotify-green fill-spotify-black" />
            </span>
          )}
        </div>

        {/* 사용자 정보: 핸들, 이름, 역할 */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide">
            <span className={st.highlight}>
              {user.verified ? "✓ Verified Developer" : `@${user.username}`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user.fullName || user.role}
          </h1>
          <p className={`text-xs sm:text-sm ${st.subtext} font-medium`}>{user.role}</p>
        </div>

        {/* 한 줄 소개 (Bio) */}
        <p className={`max-w-lg mx-auto leading-relaxed text-xs sm:text-sm ${st.subtext}`}>
          {user.bio}
        </p>

        {/* 개발자 주요 지표 통계 (Stats) */}
        <div
          className={`flex flex-wrap items-center justify-center gap-3 pt-1 text-xs ${st.subtext}`}
        >
          <span className="flex items-center gap-1">
            <strong className="text-white font-semibold">{user.monthlyCommits}</strong> Commits
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center gap-1">
            <strong className="text-white font-semibold">{user.reposCount}</strong> Repos
          </span>
          <span className="text-zinc-600">•</span>
          <span className={`flex items-center gap-1.5 ${st.highlight}`}>
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <strong className="font-semibold">{user.uptime}</strong> Uptime
          </span>
        </div>

        {/* 액션 버튼군 (재생 토글 & Contact) */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onTogglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${st.accentBtn}`}
            title={isPlaying ? "Pause music" : "Play music"}
            aria-label={isPlaying ? "음악 일시정지" : "음악 재생"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
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
