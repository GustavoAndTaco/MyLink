"use client";

import { BlockItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Link2, MousePointerClick, TrendingUp } from "lucide-react";

interface StatsSectionProps {
  blocks: BlockItem[];
}

export default function StatsSection({ blocks }: StatsSectionProps) {
  const activeBlocks = blocks.filter((b) => b.isActive);
  const totalClicks = blocks.reduce((sum, b) => sum + (b.clickCount ?? 0), 0);

  const sortedByClicks = [...blocks].sort(
    (a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0)
  );
  const topBlock = sortedByClicks[0];
  const topClicks = topBlock?.clickCount ?? 0;

  return (
    <Card className="border border-spotify-border bg-spotify-surface shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-spotify-green" />
            <h2 className="text-sm font-bold text-white">링크 통계</h2>
          </div>
          <Badge variant="spotify">실시간 집계</Badge>
        </div>

        {/* 요약 지표 3종 */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-[#1f1f1f] p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-spotify-subtext">
              <Link2 className="h-3.5 w-3.5 text-spotify-green" />
              <span>활성 링크</span>
            </div>
            <p className="text-lg font-extrabold text-white">
              {activeBlocks.length}
              <span className="text-xs font-normal text-spotify-subtext ml-1">
                / {blocks.length}
              </span>
            </p>
          </div>

          <div className="rounded-lg bg-[#1f1f1f] p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-spotify-subtext">
              <MousePointerClick className="h-3.5 w-3.5 text-spotify-green" />
              <span>총 클릭수</span>
            </div>
            <p className="text-lg font-extrabold text-spotify-green">
              {totalClicks.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg bg-[#1f1f1f] p-3 space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-spotify-subtext">
              <TrendingUp className="h-3.5 w-3.5 text-spotify-green shrink-0" />
              <span className="truncate">인기 링크</span>
            </div>
            <p className="text-xs font-bold text-white truncate pt-1">
              {topBlock && topClicks > 0 ? topBlock.title : "-"}
            </p>
            <p className="text-[10px] font-mono text-spotify-subtext">
              {topBlock && topClicks > 0 ? `${topClicks.toLocaleString()} clicks` : "기록 없음"}
            </p>
          </div>
        </div>

        {/* 링크별 클릭 분포 */}
        {blocks.length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-semibold text-spotify-subtext">
              링크별 클릭 현황
            </p>
            <div className="space-y-2">
              {sortedByClicks.slice(0, 5).map((block) => {
                const count = block.clickCount ?? 0;
                const ratio =
                  totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;

                return (
                  <div key={block.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="truncate text-zinc-200 font-medium pr-2">
                        {block.title}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-spotify-subtext">
                        {count.toLocaleString()}회 ({ratio}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#121212]">
                      <div
                        className="h-full rounded-full bg-spotify-green transition-all duration-300"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
