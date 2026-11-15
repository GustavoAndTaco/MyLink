"use client";

import { UserAccountInfo } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Link2, LogOut, UserCheck } from "lucide-react";

interface TopNavHeaderProps {
  account: UserAccountInfo | null;
  isAuthLoading: boolean;
  isPreviewMode: boolean;
  isSummaryOpen: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onTogglePreview: () => void;
  onToggleSummary: () => void;
}

function GoogleMarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

export default function TopNavHeader({
  account,
  isAuthLoading,
  isPreviewMode,
  isSummaryOpen,
  onLogin,
  onLogout,
  onTogglePreview,
  onToggleSummary,
}: TopNavHeaderProps) {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-spotify-border bg-spotify-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        {/* 브랜드 로고 */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-spotify-green text-black shadow-md">
            <Link2 className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            MyLink
          </span>
          <Badge variant="spotify" className="hidden sm:inline-flex">
            DEV
          </Badge>
        </div>

        {/* 우측 인증/액션 영역 */}
        <div className="flex items-center gap-2">
          {isAuthLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          ) : account ? (
            <>
              {/* 계정 요약 토글 버튼 */}
              <button
                type="button"
                onClick={onToggleSummary}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isSummaryOpen
                    ? "bg-spotify-elevated text-white ring-1 ring-spotify-green/60"
                    : "bg-[#1f1f1f] text-zinc-200 hover:bg-spotify-elevated hover:text-white"
                }`}
                title="계정 요약 정보 보기"
              >
                {account.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={account.photoURL}
                    alt={account.displayName}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <UserCheck className="h-3.5 w-3.5 text-spotify-green" />
                )}
                <span className="max-w-[100px] truncate">{account.displayName}</span>
              </button>

              {/* 미리보기 토글 버튼 */}
              <button
                type="button"
                onClick={onTogglePreview}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isPreviewMode
                    ? "bg-spotify-green text-black hover:bg-spotify-green-hover"
                    : "border border-zinc-600 bg-transparent text-white hover:border-white hover:bg-white/5"
                }`}
                title={isPreviewMode ? "편집 모드로 전환" : "방문자 미리보기"}
              >
                {isPreviewMode ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">편집</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">미리보기</span>
                  </>
                )}
              </button>

              {/* 로그아웃 버튼 */}
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-[#1f1f1f] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 transition-all hover:border-zinc-500 hover:text-white cursor-pointer"
                title="로그아웃"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="flex items-center gap-2 rounded-full bg-spotify-green px-4 py-2 text-xs font-bold uppercase tracking-wider text-black shadow-lg transition-all hover:scale-105 hover:bg-spotify-green-hover active:scale-95 cursor-pointer"
            >
              <GoogleMarkIcon className="h-4 w-4 rounded-full bg-white p-0.5" />
              <span>Google 로그인</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
