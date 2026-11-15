"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Code2,
  FolderGit2,
  Layers,
  Lock,
  ShieldCheck,
} from "lucide-react";

interface LoggedOutViewProps {
  onLogin: () => void;
}

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "개인화된 클라우드 저장소",
    description:
      "Google 계정 UID 기반의 독립된 공간(users/{uid}/links)에 내 프로필과 링크를 안전하게 보관합니다.",
  },
  {
    icon: FolderGit2,
    title: "개발자 특화 4대 블록",
    description:
      "일반 URL 링크, GitHub Pinned Repo, 기술 스택 뱃지, 프로젝트 쇼케이스를 한눈에 정리하세요.",
  },
  {
    icon: Layers,
    title: "드래그 편집 & 방문자 미리보기",
    description:
      "커서 드래그로 링크 순서를 자유롭게 바꾸고, 방문자에게 보이는 화면을 즉시 미리볼 수 있습니다.",
  },
];

export default function LoggedOutView({ onLogin }: LoggedOutViewProps) {
  return (
    <main className="flex-1 w-full bg-spotify-black text-white">
      {/* 히어로 섹션 */}
      <section className="w-full border-b border-spotify-border bg-gradient-to-b from-[#253828]/60 via-[#162218]/40 to-spotify-black px-4 py-16 sm:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center space-y-5">
          <Badge variant="spotify" className="gap-1.5 px-3 py-1 text-xs">
            <Code2 className="h-3.5 w-3.5" />
            <span>Developer Link Hub</span>
          </Badge>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            로그인 후 나만의 개발자 링크를
            <br />
            관리해보세요
          </h1>

          <p className="max-w-lg text-sm sm:text-base text-spotify-subtext leading-relaxed">
            MyLink는 로그인한 사용자별 개인 공간에 프로필과 링크 목록을 저장합니다.
            Google 계정으로 로그인하면 GitHub 저장소, 기술 스택, 프로젝트 쇼케이스를
            바로 추가하고 편집할 수 있습니다.
          </p>

          {/* 로그인 안내 배너 */}
          <div className="flex items-center gap-2 rounded-full bg-[#1f1f1f] px-4 py-2 text-xs text-zinc-300 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
            <Lock className="h-3.5 w-3.5 text-spotify-green shrink-0" />
            <span>
              현재 로그아웃 상태입니다. 로그인 이후 링크 추가 및 프로필 편집 기능을 사용할 수 있습니다.
            </span>
          </div>

          {/* Primary Pill CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex items-center gap-2.5 rounded-full bg-spotify-green px-7 py-3.5 text-sm font-bold uppercase tracking-[1.4px] text-black shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all hover:scale-105 hover:bg-spotify-green-hover active:scale-95 cursor-pointer"
            >
              <span>Google로 시작하기</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* 기능 소개 카드 그리드 */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-white">
            로그인 후 제공되는 기능
          </h2>
          <span className="text-xs text-spotify-subtext">
            Firebase Auth · Firestore 연동
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="bg-spotify-surface hover:bg-spotify-elevated transition-colors duration-200 shadow-[0_8px_8px_rgba(0,0,0,0.3)]"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1f1f1f] text-spotify-green">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-spotify-subtext leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
