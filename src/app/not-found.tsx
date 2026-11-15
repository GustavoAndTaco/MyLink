import Link from "next/link";
import { ArrowLeft, Link2, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-spotify-black text-white">
      <nav className="w-full border-b border-spotify-border bg-spotify-black/90">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-spotify-green text-black shadow-md">
              <Link2 className="h-4 w-4 stroke-[2.5]" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              MyLink
            </span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-spotify-border bg-spotify-surface p-8 text-center shadow-[0_8px_24px_rgba(0,0,0,0.5)] space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1f1f1f] text-[#f3727f]">
            <SearchX className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[1.6px] text-spotify-green">
              404 Not Found
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              사용자를 찾을 수 없습니다
            </h1>
            <p className="text-xs sm:text-sm text-spotify-subtext leading-relaxed">
              입력하신 <code className="text-zinc-200">displayName</code>에 해당하는
              프로필이 존재하지 않거나 삭제되었습니다.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-spotify-green px-6 py-3 text-xs font-bold uppercase tracking-[1.4px] text-black transition-all hover:scale-105 hover:bg-spotify-green-hover active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>홈으로 돌아가기</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
