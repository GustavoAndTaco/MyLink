"use client";

import { ProfileData } from "@/types";
import { useState } from "react";

interface ProfileViewProps {
  data: ProfileData;
}

export default function ProfileView({ data }: ProfileViewProps) {
  const { user, theme, blocks, socialLinks } = data;
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(true);

  // 테마별 스타일 정의
  const getThemeStyles = () => {
    switch (theme) {
      case "github-dark":
        return {
          wrapper: "bg-[#0d1117] text-[#c9d1d9] font-sans",
          headerGlow: "bg-gradient-to-b from-[#161b22] to-[#0d1117]",
          card: "bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] hover:bg-[#21262d]",
          accentBtn: "bg-[#238636] hover:bg-[#2ea043] text-white rounded-md font-semibold",
          pillBtn: "border border-[#30363d] hover:border-[#8b949e] text-[#c9d1d9] rounded-md",
          highlight: "text-[#58a6ff]",
          badge: "bg-[#21262d] text-[#58a6ff] border border-[#30363d]",
          avatarBorder: "border-2 border-[#30363d]",
          subtext: "text-[#8b949e]",
          nowPlaying: "bg-[#161b22] border-t border-[#30363d] text-[#c9d1d9]",
        };
      case "monokai":
        return {
          wrapper: "bg-[#272822] text-[#f8f8f2] font-mono",
          headerGlow: "bg-gradient-to-b from-[#3e3d32] to-[#272822]",
          card: "bg-[#3e3d32] border border-[#49483e] hover:border-[#a6e22e] hover:bg-[#49483e]",
          accentBtn: "bg-[#a6e22e] hover:bg-[#bbf444] text-[#272822] rounded-lg font-bold",
          pillBtn: "border border-[#f92672] text-[#f92672] hover:bg-[#f92672] hover:text-white rounded-lg",
          highlight: "text-[#66d9ef]",
          badge: "bg-[#49483e] text-[#e6db74] border border-[#75715e]",
          avatarBorder: "border-2 border-[#a6e22e]",
          subtext: "text-[#75715e]",
          nowPlaying: "bg-[#3e3d32] border-t border-[#49483e] text-[#f8f8f2]",
        };
      case "minimal-light":
        return {
          wrapper: "bg-[#f8fafc] text-zinc-900 font-sans",
          headerGlow: "bg-gradient-to-b from-white to-[#f8fafc]",
          card: "bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-md",
          accentBtn: "bg-zinc-900 hover:bg-black text-white rounded-full font-bold",
          pillBtn: "border border-zinc-300 hover:border-zinc-800 text-zinc-800 rounded-full",
          highlight: "text-blue-600",
          badge: "bg-zinc-100 text-zinc-800 border border-zinc-200",
          avatarBorder: "border-2 border-zinc-200 shadow-sm",
          subtext: "text-zinc-500",
          nowPlaying: "bg-white border-t border-zinc-200 text-zinc-900 shadow-lg",
        };
      case "spotify-dark":
      default:
        return {
          wrapper: "bg-[#121212] text-white font-sans",
          headerGlow: "bg-gradient-to-b from-[#2d382e] via-[#1a221b] to-[#121212]",
          card: "bg-[#181818] border border-transparent hover:border-[#333333] hover:bg-[#242424] shadow-[0_8px_16px_rgba(0,0,0,0.3)]",
          accentBtn: "bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 text-black rounded-full font-bold",
          pillBtn: "border border-[#7c7c7c] hover:border-white text-white rounded-full tracking-[1.4px]",
          highlight: "text-[#1ed760]",
          badge: "bg-[#1f1f1f] text-[#b3b3b3] border border-[#333333]",
          avatarBorder: "border-2 border-[#1ed760]/60 shadow-[0_8px_24px_rgba(0,0,0,0.6)]",
          subtext: "text-[#b3b3b3]",
          nowPlaying: "bg-[#181818] border-t border-[#282828] text-white",
        };
    }
  };

  const st = getThemeStyles();
  const activeBlocks = blocks.filter((b) => b.isActive);

  return (
    <div className={`w-full min-h-screen flex flex-col ${st.wrapper} pb-28 select-none`}>
      {/* Top Header Glow & Profile Hero */}
      <div className={`w-full ${st.headerGlow} pt-12 pb-10 px-6 sm:px-8`}>
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="relative group">
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden flex items-center justify-center bg-zinc-800 ${st.avatarBorder} text-5xl transition-transform duration-200 group-hover:scale-105`}
            >
              {user.avatar}
            </div>
            {user.verified && (
              <span className="absolute bottom-1 right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-[#121212]"></span>
              </span>
            )}
          </div>

          {/* Name & Role */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold">
              <span className={st.highlight}>
                {user.verified ? "✓ Verified Developer" : `@${user.username}`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {user.fullName || user.role}
            </h1>
            <p className={`text-xs sm:text-sm ${st.subtext} font-medium`}>{user.role}</p>
          </div>

          {/* Bio */}
          <p className={`max-w-lg mx-auto leading-relaxed text-xs sm:text-sm ${st.subtext}`}>
            {user.bio}
          </p>

          {/* Developer Stats */}
          <div
            className={`flex flex-wrap items-center justify-center gap-3 pt-1 text-xs ${st.subtext}`}
          >
            <span>
              <strong className="text-white">{user.monthlyCommits}</strong> Commits
            </span>
            <span>•</span>
            <span>
              <strong className="text-white">{user.reposCount}</strong> Repos
            </span>
            <span>•</span>
            <span className={st.highlight}>
              <strong>{user.uptime}</strong> Uptime
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-12 h-12 flex items-center justify-center shadow-md transition-all ${st.accentBtn}`}
              title="Play / Pause"
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
            <a
              href={`mailto:${socialLinks.email || "developer@example.com"}`}
              className={`px-6 py-2.5 text-xs font-bold uppercase transition-all ${st.pillBtn}`}
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Main Blocks Container */}
      <main className="flex-1 w-full max-w-xl mx-auto space-y-3.5 px-4 mt-6">
        {activeBlocks.length === 0 ? (
          <div className={`p-8 text-center rounded-xl ${st.card} ${st.subtext}`}>
            표시할 링크가 없습니다.
          </div>
        ) : (
          activeBlocks.map((block) => {
            // 1. 일반 링크 카드
            if (block.type === "link") {
              return (
                <a
                  key={block.id}
                  href={block.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-150 cursor-pointer ${st.card}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-3">
                    <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {block.icon || "🔗"}
                    </span>
                    <div className="truncate">
                      <div className="font-bold text-sm truncate group-hover:underline">
                        {block.title}
                      </div>
                      {block.subtitle && (
                        <div className={`text-xs truncate ${st.subtext} mt-0.5`}>
                          {block.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {block.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.badge}`}
                      >
                        {block.badge}
                      </span>
                    )}
                    <span className={`text-xs font-semibold ${st.highlight}`}>
                      →
                    </span>
                  </div>
                </a>
              );
            }

            // 2. GitHub Pinned Repo 카드
            if (block.type === "github_repo") {
              const repo = block.pinnedRepo;
              return (
                <a
                  key={block.id}
                  href={block.url || "https://github.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-4 rounded-xl transition-all duration-150 cursor-pointer ${st.card}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span>📁</span>
                      <span className={st.highlight}>
                        {repo?.name || block.title}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.badge}`}
                    >
                      Public Repo
                    </span>
                  </div>
                  <p className={`text-xs mb-3 line-clamp-2 ${st.subtext}`}>
                    {repo?.description || block.subtitle}
                  </p>
                  <div className={`flex items-center gap-4 text-[11px] ${st.subtext}`}>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: repo?.languageColor || "#3178c6" }}
                      ></span>
                      {repo?.language || "TypeScript"}
                    </span>
                    <span>⭐ {repo?.stars ?? 0}</span>
                    <span>🍴 {repo?.forks ?? 0}</span>
                  </div>
                </a>
              );
            }

            // 3. 기술 스택 뱃지 클러스터
            if (block.type === "tech_stack") {
              const stack = block.techStack || [];
              return (
                <div
                  key={block.id}
                  className={`p-4 rounded-xl transition-all ${st.card}`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-bold text-xs flex items-center gap-2">
                      <span>⚡</span> {block.title}
                    </span>
                    <span className={`text-[10px] ${st.subtext}`}>
                      {stack.length} Stacks
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {stack.map((item) => (
                      <span
                        key={item}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${st.badge}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            // 4. 프로젝트 쇼케이스 카드
            if (block.type === "project") {
              const proj = block.project;
              return (
                <div
                  key={block.id}
                  className={`p-4 rounded-xl space-y-3 transition-all ${st.card}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <span>🚀</span> {block.title}
                      </h3>
                      <p className={`text-xs mt-1 ${st.subtext}`}>
                        {block.subtitle}
                      </p>
                    </div>
                    {block.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${st.badge}`}
                      >
                        {block.badge}
                      </span>
                    )}
                  </div>

                  {proj?.tags && (
                    <div className="flex flex-wrap gap-1">
                      {proj.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded bg-black/20 text-zinc-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    {proj?.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 text-center py-2 text-xs font-bold transition-all ${st.accentBtn}`}
                      >
                        Live Demo ↗
                      </a>
                    )}
                    {proj?.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 text-center py-2 text-xs font-bold transition-all ${st.pillBtn}`}
                      >
                        GitHub Code ↗
                      </a>
                    )}
                  </div>
                </div>
              );
            }

            return null;
          })
        )}

        {/* Footer */}
        <div className={`pt-8 pb-4 text-center text-xs ${st.subtext} space-y-1.5`}>
          <p>© 2026 {user.fullName || user.username} • Powered by MyLink</p>
          <div className="flex justify-center gap-4 pt-1">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            )}
            {socialLinks.blog && (
              <a
                href={socialLinks.blog}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Blog
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </main>

      {/* Spotify 테마일 때 하단 Now Playing 바 */}
      {theme === "spotify-dark" && (
        <aside
          className={`fixed bottom-0 left-0 right-0 h-16 ${st.nowPlaying} z-40 px-4 sm:px-6 flex items-center justify-between select-none text-xs`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-[#1ed760] to-[#121212] flex items-center justify-center text-base shrink-0 shadow-sm">
              💻
            </div>
            <div className="truncate">
              <div className="font-bold text-white truncate">
                Building The Next Web
              </div>
              <div className="text-[11px] text-[#b3b3b3] truncate">
                {user.role}
              </div>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`cursor-pointer ml-1 ${
                isLiked ? "text-[#1ed760]" : "text-zinc-500"
              }`}
            >
              ♥
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
              <span>01:42</span>
              <div className="w-24 h-1 bg-zinc-700 rounded-full overflow-hidden">
                <div className="w-2/5 h-full bg-white rounded-full"></div>
              </div>
              <span>03:45</span>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs hover:scale-105 transition-transform"
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
