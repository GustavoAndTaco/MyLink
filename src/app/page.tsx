"use client";

import { useState } from "react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const links = [
    {
      id: 1,
      title: "GitHub Repository",
      artist: "github.com/developer",
      album: "Open Source Works",
      duration: "3:45",
      coverColor: "from-purple-900 to-indigo-900",
      icon: "🐙",
      url: "https://github.com",
      badge: "Main Hub",
    },
    {
      id: 2,
      title: "Tech Blog (Velog)",
      artist: "velog.io/@developer",
      album: "Engineering Notes",
      duration: "4:12",
      coverColor: "from-emerald-900 to-teal-950",
      icon: "✍️",
      url: "https://velog.io",
      badge: "Articles",
    },
    {
      id: 3,
      title: "Interactive Portfolio",
      artist: "portfolio.dev",
      album: "Production Showcase",
      duration: "5:08",
      coverColor: "from-blue-900 to-slate-900",
      icon: "🚀",
      url: "#",
      badge: "Showcase",
    },
    {
      id: 4,
      title: "Resume & Career History",
      artist: "resume.pdf",
      album: "Professional Experience",
      duration: "2:30",
      coverColor: "from-amber-900 to-stone-900",
      icon: "📄",
      url: "#",
      badge: "Document",
    },
    {
      id: 5,
      title: "Contact & Coffee Chat",
      artist: "developer@example.com",
      album: "Collaboration & Inquiries",
      duration: "3:15",
      coverColor: "from-rose-900 to-zinc-900",
      icon: "📫",
      url: "mailto:developer@example.com",
      badge: "Direct Mail",
    },
  ];

  const playlists = [
    {
      name: "Frontend Mastery",
      description: "Next.js 16, React 19, TypeScript, Tailwind CSS v4",
      tracks: "8 Projects",
      cover: "⚡",
      gradient: "from-cyan-900 to-blue-950",
    },
    {
      name: "Backend & Systems",
      description: "Node.js, PostgreSQL, Redis, RESTful & GraphQL",
      tracks: "12 Projects",
      cover: "🛠️",
      gradient: "from-emerald-900 to-neutral-900",
    },
    {
      name: "DevOps & Cloud",
      description: "Docker, Kubernetes, AWS, CI/CD Actions",
      tracks: "6 Projects",
      cover: "☁️",
      gradient: "from-orange-900 to-stone-900",
    },
    {
      name: "Clean Code & Architecture",
      description: "Domain-Driven Design, Test Automation, UX Focus",
      tracks: "15 Repos",
      cover: "🎧",
      gradient: "from-violet-900 to-zinc-950",
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col pb-28 selection:bg-[#1ed760] selection:text-black">
      {/* Top Background Ambient Glow */}
      <div className="w-full bg-gradient-to-b from-[#2d382e] via-[#1a221b] to-[#121212] pt-8 pb-10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1ed760] text-black font-black text-sm">
                ≈
              </span>
              <span className="text-sm font-bold tracking-tight text-white">
                DevLink <span className="text-[#b3b3b3] font-normal">• Spotify Edition</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[1.4px] bg-[#1f1f1f] text-[#b3b3b3] border border-[#333333]">
                v2.0 Online
              </span>
            </div>
          </div>

          {/* Artist / Developer Profile Hero */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            {/* Avatar / Cover */}
            <div className="relative group shrink-0">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.6)] bg-gradient-to-br from-[#1ed760] via-[#1db954] to-[#121212] p-1">
                <div className="w-full h-full rounded-full bg-[#181818] flex items-center justify-center text-6xl select-none">
                  👨‍💻
                </div>
              </div>
              <span className="absolute bottom-2 right-2 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1ed760] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-[#1ed760] border-2 border-[#121212]"></span>
              </span>
            </div>

            {/* Profile Info */}
            <div className="space-y-3 text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-semibold text-[#539df5]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span>인증된 개발자 (Verified Developer)</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Full-Stack Engineer
              </h1>

              <p className="text-sm sm:text-base text-[#b3b3b3] leading-relaxed max-w-2xl font-normal">
                코드와 기술로 사람과 가치를 잇는 개발자입니다. 직관적인 사용자 경험(UX)과
                견고한 시스템 아키텍처를 추구하며, 복잡한 문제를 단순하고 우아하게 풀어냅니다.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-[#b3b3b3]">
                <span className="text-white font-bold">1,337+</span> 월간 커밋
                <span>•</span>
                <span className="text-white font-bold">24+</span> 오픈소스 & 서비스 기여
                <span>•</span>
                <span className="text-[#1ed760] font-bold">99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 space-y-10 mt-6">
        {/* Action Bar (Play, Follow, Options) */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Circular Play Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "일시정지" : "재생"}
            className="w-14 h-14 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 active:scale-95 transition-all duration-150 flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.4)] cursor-pointer"
          >
            {isPlaying ? (
              <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-black fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Follow / Contact Outlined Pill */}
          <a
            href="mailto:developer@example.com"
            className="rounded-full border border-[#7c7c7c] hover:border-white text-white text-xs font-bold uppercase tracking-[1.6px] px-6 py-2.5 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            Follow & Contact
          </a>

          {/* More Action */}
          <button
            onClick={() => alert("개발자 프로필 링크가 클립보드에 복사되었습니다!")}
            title="공유하기"
            className="w-10 h-10 rounded-full text-[#b3b3b3] hover:text-white flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>

        {/* Section 1: Popular Tracks (Links) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              대표 링크 (Featured Tracks)
            </h2>
            <span className="text-xs font-semibold text-[#b3b3b3] uppercase tracking-[1.4px]">
              5 Tracks
            </span>
          </div>

          <div className="space-y-1">
            {links.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-2.5 sm:p-3 rounded-[6px] hover:bg-[#ffffff14] transition-colors duration-150 cursor-pointer"
              >
                {/* Track Left: Number / Play Icon + Cover + Info */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-4">
                  {/* Track Number or Hover Play */}
                  <span className="w-4 text-center text-sm font-semibold text-[#b3b3b3] group-hover:hidden">
                    {index + 1}
                  </span>
                  <span className="w-4 text-center text-xs text-white hidden group-hover:inline-block">
                    ▶
                  </span>

                  {/* Album Cover Thumbnail */}
                  <div
                    className={`w-10 h-10 rounded-[6px] bg-gradient-to-br ${link.coverColor} flex items-center justify-center text-lg shrink-0 shadow-sm`}
                  >
                    {link.icon}
                  </div>

                  {/* Title & Artist */}
                  <div className="truncate">
                    <div className="text-sm sm:text-base font-semibold text-white group-hover:text-[#1ed760] transition-colors truncate">
                      {link.title}
                    </div>
                    <div className="text-xs text-[#b3b3b3] truncate group-hover:text-white transition-colors">
                      {link.artist}
                    </div>
                  </div>
                </div>

                {/* Album Name (Hidden on Mobile) */}
                <div className="hidden md:block w-1/3 text-xs text-[#b3b3b3] truncate">
                  {link.album}
                </div>

                {/* Right: Badge & Action */}
                <div className="flex items-center gap-3 text-right shrink-0">
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold text-[#b3b3b3] bg-[#1f1f1f] group-hover:border-[#7c7c7c] border border-transparent">
                    {link.badge}
                  </span>
                  <span className="text-xs text-[#b3b3b3] font-mono group-hover:text-[#1ed760]">
                    {link.duration}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Section 2: Tech Stack Discography / Playlists */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              기술 스택 플레이리스트 (Tech Stacks)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-[1.4px] rounded-full transition-all ${
                  activeTab === "all"
                    ? "bg-white text-black"
                    : "bg-[#1f1f1f] text-white hover:bg-[#282828]"
                }`}
              >
                All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {playlists.map((item) => (
              <div
                key={item.name}
                className="group relative p-4 rounded-[8px] bg-[#181818] hover:bg-[#252525] transition-all duration-200 cursor-pointer shadow-[0_8px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
              >
                {/* Square Album Cover */}
                <div
                  className={`relative w-full aspect-square rounded-[6px] mb-4 bg-gradient-to-br ${item.gradient} flex items-center justify-center text-4xl shadow-md overflow-hidden`}
                >
                  <span>{item.cover}</span>

                  {/* Hover Floating Spotify Green Play Button */}
                  <div className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-105">
                    <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Card Meta */}
                <h3 className="text-sm font-bold text-white tracking-tight truncate mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-[#b3b3b3] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-3 text-[11px] font-semibold text-[#1ed760]">
                  {item.tracks}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Spotify Artist About Card */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            소개 (About)
          </h2>
          <div className="relative rounded-[8px] overflow-hidden bg-[#181818] p-6 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-[#282828]">
            <div className="max-w-2xl space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[1.4px] bg-[#1f1f1f] text-[#1ed760] border border-[#1db954]/30">
                Engineering Philosophy
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                "사용자가 머무는 화면 뒤편의 복잡함을 정돈하고, 가장 직관적인 경험을 만듭니다."
              </h3>
              <p className="text-sm text-[#b3b3b3] leading-relaxed">
                모던 프론트엔드 프레임워크와 마이크로서비스 아키텍처에 깊은 관심을 가지고 있습니다.
                단순히 동작하는 코드를 넘어, 팀원 누구나 읽고 유지보수하기 쉬운 클린 코드와
                체계적인 디자인 시스템 구현을 즐깁니다.
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                {["TypeScript", "React 19", "Next.js", "Tailwind CSS", "Architecture"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1f1f1f] text-white border border-[#4d4d4d]"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-[#282828] text-xs text-[#b3b3b3] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Developer Link • Inspired by Spotify Design System</p>
          <div className="flex gap-4 uppercase tracking-[1.4px] text-[11px] font-semibold">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="https://velog.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Velog
            </a>
            <a href="mailto:developer@example.com" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </footer>
      </main>

      {/* Fixed Sticky Now-Playing Bar */}
      <aside className="fixed bottom-0 left-0 right-0 h-20 bg-[#181818] border-t border-[#282828] z-50 px-4 sm:px-6 flex items-center justify-between select-none">
        {/* Left: Track Info */}
        <div className="flex items-center gap-3 w-1/4 min-w-[140px]">
          <div className="w-12 h-12 rounded-[4px] bg-gradient-to-br from-[#1ed760] to-[#121212] flex items-center justify-center text-xl shrink-0 shadow-md">
            💻
          </div>
          <div className="truncate">
            <div className="text-xs sm:text-sm font-semibold text-white hover:underline cursor-pointer truncate">
              Building The Next Web
            </div>
            <div className="text-[11px] text-[#b3b3b3] hover:underline cursor-pointer truncate">
              Full-Stack Developer
            </div>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            aria-label="좋아요"
            className={`hidden sm:flex text-sm transition-colors cursor-pointer ${
              isLiked ? "text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"
            }`}
          >
            ♥
          </button>
        </div>

        {/* Center: Controls & Timeline */}
        <div className="flex flex-col items-center gap-1.5 max-w-md w-2/4">
          <div className="flex items-center gap-4 text-[#b3b3b3]">
            <button
              title="셔플"
              className="text-xs hover:text-white transition-colors cursor-pointer"
            >
              ⇄
            </button>
            <button
              title="이전 트랙"
              className="text-sm hover:text-white transition-colors cursor-pointer"
            >
              ⏮
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-white text-black hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            >
              {isPlaying ? (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              title="다음 트랙"
              className="text-sm hover:text-white transition-colors cursor-pointer"
            >
              ⏭
            </button>
            <button
              title="반복"
              className="text-xs hover:text-[#1ed760] transition-colors cursor-pointer"
            >
              ↻
            </button>
          </div>

          {/* Timeline Bar */}
          <div className="w-full flex items-center gap-2 text-[10px] text-[#b3b3b3] font-mono">
            <span>01:42</span>
            <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full overflow-hidden cursor-pointer group">
              <div className="h-full w-2/5 bg-white group-hover:bg-[#1ed760] transition-colors rounded-full relative"></div>
            </div>
            <span>03:45</span>
          </div>
        </div>

        {/* Right: Auxiliary Controls */}
        <div className="flex items-center justify-end gap-3 w-1/4 text-[#b3b3b3]">
          <span className="hidden md:inline-block text-xs hover:text-white cursor-pointer" title="가사">
            🎤
          </span>
          <span className="hidden md:inline-block text-xs hover:text-white cursor-pointer" title="대기열">
            📑
          </span>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs">🔊</span>
            <div className="w-16 h-1 bg-[#4d4d4d] rounded-full overflow-hidden cursor-pointer group">
              <div className="h-full w-3/4 bg-white group-hover:bg-[#1ed760] transition-colors rounded-full"></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
