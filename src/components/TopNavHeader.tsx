"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UserAccountInfo } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ExternalLink,
  Eye,
  EyeOff,
  LayoutDashboard,
  Link2,
  LogOut,
  UserCheck,
  UserPen,
} from "lucide-react";

interface TopNavHeaderProps {
  account: UserAccountInfo | null;
  isAuthLoading: boolean;
  isPreviewMode: boolean;
  isSummaryOpen: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onTogglePreview: () => void;
  onToggleSummary: () => void;
  onOpenProfileEdit: () => void;
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
  onOpenProfileEdit,
}: TopNavHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const publicPageHref = account
    ? `/${encodeURIComponent(account.displayName)}`
    : "/";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-spotify-border bg-spotify-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        {/* 브랜드 로고 */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-spotify-green text-black shadow-md">
            <Link2 className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            MyLink
          </span>
          <Badge variant="spotify" className="hidden sm:inline-flex">
            DEV
          </Badge>
        </Link>

        {/* 우측 인증/액션 영역 */}
        <div className="flex items-center gap-2">
          {isAuthLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          ) : account ? (
            <>
              {/* 헤더 개인별 페이지 바로가기 */}
              <Link
                href={publicPageHref}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#1f1f1f] px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-spotify-elevated hover:text-spotify-green transition-colors"
                title={`/${account.displayName} 공개 페이지로 이동`}
              >
                <ExternalLink className="h-3.5 w-3.5 text-spotify-green" />
                <span>/{account.displayName}</span>
              </Link>

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

              {/* 프로필 드롭다운 */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    isDropdownOpen
                      ? "bg-spotify-elevated text-white ring-1 ring-spotify-green/60"
                      : "bg-[#1f1f1f] text-zinc-200 hover:bg-spotify-elevated hover:text-white"
                  }`}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="menu"
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
                  <span className="max-w-[90px] truncate">{account.displayName}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                </button>

                {isDropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-spotify-border bg-spotify-surface p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.65)]"
                  >
                    <div className="px-3 py-2 border-b border-spotify-border mb-1">
                      <p className="text-xs font-bold text-white truncate">
                        {account.displayName}
                      </p>
                      <p className="text-[11px] text-spotify-subtext truncate">
                        {account.email}
                      </p>
                    </div>

                    <Link
                      href={publicPageHref}
                      onClick={() => setIsDropdownOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-spotify-elevated hover:text-spotify-green transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-spotify-green" />
                      <span>내 공개 페이지 (/{account.displayName})</span>
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenProfileEdit();
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-spotify-elevated hover:text-white transition-colors cursor-pointer"
                    >
                      <UserPen className="h-3.5 w-3.5 text-spotify-green" />
                      <span>프로필 · 소셜 링크 편집</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onToggleSummary();
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-spotify-elevated hover:text-white transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-spotify-green" />
                      <span>{isSummaryOpen ? "계정 요약 숨기기" : "계정 요약 보기"}</span>
                    </button>

                    <div className="my-1 border-t border-spotify-border" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#f3727f] hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                )}
              </div>
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
