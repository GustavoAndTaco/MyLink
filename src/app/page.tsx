export default function Home() {
  const skills = ["TypeScript", "Next.js", "React", "Node.js", "Tailwind CSS"];

  const links = [
    {
      title: "GitHub",
      description: "오픈소스 및 프로젝트 저장소",
      icon: "🐙",
      url: "https://github.com",
    },
    {
      title: "Tech Blog",
      description: "배운 점과 기술적인 고민을 기록하는 공간",
      icon: "✍️",
      url: "https://velog.io",
    },
    {
      title: "Portfolio",
      description: "진행한 프로젝트 및 작업물 모음",
      icon: "🚀",
      url: "#",
    },
    {
      title: "Contact / Email",
      description: "협업 제안 및 문의하기",
      icon: "📫",
      url: "mailto:developer@example.com",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
      <main className="w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-zinc-900/90 backdrop-blur-sm rounded-3xl shadow-xl border border-zinc-200/80 dark:border-zinc-800 text-center space-y-6">
        {/* 프로필 이미지 & 상태 배지 */}
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-md">
            <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-4xl">
              👨‍💻
            </div>
          </div>
          <span className="absolute bottom-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-zinc-900"></span>
          </span>
        </div>

        {/* 개발자 소개글 영역 */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-full border border-indigo-100 dark:border-indigo-900/50">
            <span>✨ Full-Stack Developer</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-700 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
            코드와 기술로 가치를 짓는 개발자
          </h1>

          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            안녕하세요! 복잡한 문제를 단순하고 우아한 코드로 해결하는 소프트웨어 엔지니어입니다.
            직관적인 사용자 경험(UX)과 견고한 시스템 아키텍처를 고민하며,
            어제보다 오늘 더 성장하는 개발을 지향합니다.
          </p>
        </div>

        {/* 기술 스택 태그 */}
        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* 주요 링크 리스트 */}
        <div className="space-y-3 pt-2">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 border border-zinc-200/80 dark:border-zinc-700/60 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all duration-200 shadow-xs hover:shadow-md"
            >
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {link.icon}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {link.description}
                  </p>
                </div>
              </div>
              <span className="text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all text-xs font-semibold">
                →
              </span>
            </a>
          ))}
        </div>

        {/* 푸터 */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-400 dark:text-zinc-500">
          <p>© 2026 Developer Portfolio • Built with Next.js & Tailwind CSS</p>
        </div>
      </main>
    </div>
  );
}
