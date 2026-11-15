"use client";

import { UserAccountInfo } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppToast } from "@/components/ui/toast";
import {
  Clock,
  Copy,
  Database,
  Eye,
  Link2,
  Mail,
  User,
} from "lucide-react";

interface AccountSummaryCardProps {
  account: UserAccountInfo;
  totalLinksCount: number;
  activeLinksCount: number;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
}

function formatUpdatedAt(timestamp?: number): string {
  if (!timestamp) return "방금 전";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export default function AccountSummaryCard({
  account,
  totalLinksCount,
  activeLinksCount,
  isPreviewMode,
  onTogglePreview,
}: AccountSummaryCardProps) {
  const toast = useAppToast();

  const handleCopyUid = async () => {
    try {
      await navigator.clipboard.writeText(account.uid);
      toast.success("UID가 복사되었습니다", account.uid);
    } catch {
      toast.error("복사에 실패했습니다", "브라우저 클립보드 권한을 확인해주세요.");
    }
  };

  const handleCopySummary = async () => {
    const summaryText = [
      `MyLink 계정 요약`,
      `- Display Name: ${account.displayName}`,
      `- Email: ${account.email}`,
      `- Firestore Path: users/${account.uid}/links`,
      `- Links: ${activeLinksCount}/${totalLinksCount}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summaryText);
      toast.success("계정 요약이 복사되었습니다", `${account.displayName} (${activeLinksCount}개 활성 링크)`);
    } catch {
      toast.error("복사에 실패했습니다", "브라우저 클립보드 권한을 확인해주세요.");
    }
  };

  return (
    <Card className="border border-spotify-border bg-spotify-surface shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="spotify">계정 요약</Badge>
            <span className="text-xs font-semibold text-white">
              {account.displayName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1f1f1f] px-3 py-1.5 text-[11px] font-semibold text-zinc-200 hover:bg-spotify-elevated hover:text-white transition-colors cursor-pointer"
            >
              <Copy className="h-3 w-3 text-spotify-green" />
              <span>요약 복사</span>
            </button>

            <button
              type="button"
              onClick={onTogglePreview}
              className="inline-flex items-center gap-1.5 rounded-full bg-spotify-green px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black hover:bg-spotify-green-hover transition-colors cursor-pointer"
            >
              <Eye className="h-3 w-3" />
              <span>{isPreviewMode ? "편집하기" : "미리보기"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="flex items-center gap-2 rounded-lg bg-[#1f1f1f] px-3 py-2">
            <User className="h-3.5 w-3.5 text-spotify-green shrink-0" />
            <span className="text-spotify-subtext">Display Name:</span>
            <span className="font-semibold text-white truncate">
              {account.displayName}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-[#1f1f1f] px-3 py-2">
            <Mail className="h-3.5 w-3.5 text-spotify-green shrink-0" />
            <span className="text-spotify-subtext">Email:</span>
            <span className="font-medium text-zinc-200 truncate">
              {account.email || "-"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-lg bg-[#1f1f1f] px-3 py-2">
            <div className="flex items-center gap-2 min-w-0">
              <Database className="h-3.5 w-3.5 text-spotify-green shrink-0" />
              <span className="text-spotify-subtext shrink-0">경로:</span>
              <span className="font-mono text-[11px] text-zinc-200 truncate">
                users/{account.uid.slice(0, 8)}.../links
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyUid}
              className="shrink-0 text-[10px] font-semibold text-spotify-green hover:underline cursor-pointer"
              title="전체 UID 복사"
            >
              UID 복사
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-lg bg-[#1f1f1f] px-3 py-2">
            <div className="flex items-center gap-2">
              <Link2 className="h-3.5 w-3.5 text-spotify-green shrink-0" />
              <span className="text-spotify-subtext">링크:</span>
              <span className="font-semibold text-white">
                {activeLinksCount} / {totalLinksCount}개
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-spotify-subtext">
              <Clock className="h-3 w-3" />
              <span>{formatUpdatedAt(account.updatedAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
