export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-3xl mx-auto">
          🔗
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-full">
            Ready to Build
          </span>
          <h1 className="text-2xl font-bold tracking-tight">
            MyLink에 오신 것을 환영합니다!
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            기본 템플릿과 스타일이 초기화되었습니다.<br />
            원하는 링크와 기능을 추가하여 나만의 페이지를 만들어보세요.
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 space-y-1">
          <p>
            시작하려면{" "}
            <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-zinc-700 dark:text-zinc-300">
              src/app/page.tsx
            </code>
            를 편집하세요.
          </p>
        </div>
      </main>
    </div>
  );
}
