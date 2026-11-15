"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen w-full bg-spotify-black text-white">
      {/* 상단 네비게이션 스켈레톤 */}
      <div className="w-full border-b border-spotify-border bg-spotify-black/90">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      </div>

      {/* 프로필 헤더 스켈레톤 */}
      <div className="w-full border-b border-spotify-border bg-gradient-to-b from-[#253828]/40 via-[#162218]/30 to-spotify-black pt-12 pb-8 px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center space-y-4">
          <Skeleton className="h-28 w-28 sm:h-32 sm:w-32 rounded-full" />
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-10 w-full max-w-md rounded-lg" />
          <div className="flex items-center gap-3 pt-1">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full mt-2" />
        </div>
      </div>

      {/* 링크 카드 목록 스켈레톤 */}
      <div className="mx-auto w-full max-w-xl space-y-3.5 px-4 mt-6 pb-16">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="border border-spotify-border bg-spotify-surface">
            <CardContent className="flex items-center gap-4 p-4">
              <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/5 rounded-md" />
                <Skeleton className="h-3 w-4/5 rounded-md" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
