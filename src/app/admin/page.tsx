"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProfileData, BlockItem, ThemeType, BlockType } from "@/types";
import {
  getProfileData,
  saveProfileData,
  resetProfileData,
  getMockAuth,
  setMockAuth,
} from "@/lib/storage";
import { initialProfileData } from "@/lib/mockData";
import ProfileView from "@/components/ProfileView";

export default function AdminPage() {
  const [data, setData] = useState<ProfileData>(initialProfileData);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<"blocks" | "profile" | "analytics">("blocks");
  const [auth, setAuth] = useState({ isLoggedIn: true, username: "developer" });

  // 새 블록 추가 폼 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBlockType, setNewBlockType] = useState<BlockType>("link");
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("🔗");

  useEffect(() => {
    setIsClient(true);
    setData(getProfileData());
    setAuth(getMockAuth());

    const handleStorageUpdate = () => {
      setData(getProfileData());
    };
    const handleAuthUpdate = () => {
      setAuth(getMockAuth());
    };

    window.addEventListener("mylink_storage_update", handleStorageUpdate);
    window.addEventListener("mylink_auth_update", handleAuthUpdate);
    return () => {
      window.removeEventListener("mylink_storage_update", handleStorageUpdate);
      window.removeEventListener("mylink_auth_update", handleAuthUpdate);
    };
  }, []);

  const updateData = (newData: ProfileData) => {
    setData(newData);
    saveProfileData(newData);
  };

  // 블록 순서 이동
  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...data.blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    updateData({ ...data, blocks: newBlocks });
  };

  // 블록 토글 (활성/비활성)
  const toggleBlock = (id: string) => {
    const newBlocks = data.blocks.map((b) =>
      b.id === id ? { ...b, isActive: !b.isActive } : b
    );
    updateData({ ...data, blocks: newBlocks });
  };

  // 블록 삭제
  const deleteBlock = (id: string) => {
    if (!confirm("이 블록을 삭제하시겠습니까?")) return;
    const newBlocks = data.blocks.filter((b) => b.id !== id);
    updateData({ ...data, blocks: newBlocks });
  };

  // 블록 추가
  const handleAddBlock = () => {
    if (!newTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    const newBlock: BlockItem = {
      id: `block-${Date.now()}`,
      type: newBlockType,
      title: newTitle,
      subtitle: newSubtitle || undefined,
      url: newUrl || undefined,
      icon: newIcon || "🔗",
      clicks: 0,
      isActive: true,
      ...(newBlockType === "github_repo" && {
        pinnedRepo: {
          name: newTitle,
          description: newSubtitle || "GitHub Repository",
          stars: 12,
          forks: 3,
          language: "TypeScript",
          languageColor: "#3178c6",
        },
      }),
      ...(newBlockType === "tech_stack" && {
        techStack: newSubtitle ? newSubtitle.split(",").map((s) => s.trim()) : ["React", "TypeScript"],
      }),
      ...(newBlockType === "project" && {
        project: {
          demoUrl: newUrl,
          githubUrl: "https://github.com",
          tags: ["Project", "Dev"],
        },
      }),
    };

    updateData({ ...data, blocks: [...data.blocks, newBlock] });
    setShowAddModal(false);
    setNewTitle("");
    setNewSubtitle("");
    setNewUrl("");
  };

  // 전체 초기화
  const handleReset = () => {
    if (confirm("모든 데이터를 기본 Spotify 테마 Mock 데이터로 초기화하시겠습니까?")) {
      const reset = resetProfileData();
      setData(reset);
    }
  };

  // 가상 로그인 토글
  const handleAuthToggle = () => {
    const nextState = !auth.isLoggedIn;
    setMockAuth(nextState);
    setAuth({ ...auth, isLoggedIn: nextState });
  };

  if (!isClient) {
    return <div className="min-h-screen bg-[#121212] text-white p-8">대시보드 로딩 중...</div>;
  }

  const totalClicks = data.blocks.reduce((sum, b) => sum + (b.clicks || 0), 0);

  return (
    <div className="min-h-screen bg-[#0f0f12] text-zinc-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-14 bg-[#16161a] border-b border-zinc-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1ed760] text-black font-black text-xs">
              ≈
            </span>
            <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-[#1ed760] transition-colors">
              MyLink Studio
            </span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-xs text-zinc-400 font-medium">관리자 대시보드</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mock Auth Badge */}
          <button
            onClick={handleAuthToggle}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              auth.isLoggedIn
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
            title="클릭하여 Mock 로그인/로그아웃 전환"
          >
            <span>●</span>
            <span>{auth.isLoggedIn ? `@${auth.username} (Mock Auth)` : "Logged Out"}</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
          >
            초기화
          </button>

          {/* Live Profile Link */}
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold text-xs flex items-center gap-1 transition-all shadow-sm"
          >
            <span>공개 프로필 보기</span>
            <span>↗</span>
          </Link>
        </div>
      </header>

      {/* Main Workspace (Left Editor + Right Live Preview) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Editor Panel */}
        <section className="flex-1 flex flex-col border-r border-zinc-800 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800 px-6 pt-3 bg-[#16161a] shrink-0">
            {(
              [
                { id: "blocks", label: "블록 관리", icon: "🔗" },
                { id: "profile", label: "프로필 & 테마", icon: "🎨" },
                { id: "analytics", label: "통계 분석", icon: "📊" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "border-[#1ed760] text-[#1ed760]"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* TAB 1: BLOCKS MANAGEMENT */}
            {activeTab === "blocks" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">링크 및 콘텐츠 블록</h2>
                    <p className="text-xs text-zinc-400">드래그 순서 변경 및 새 블록을 추가하세요.</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <span>+</span>
                    <span>블록 추가</span>
                  </button>
                </div>

                {/* Blocks List */}
                <div className="space-y-2.5">
                  {data.blocks.map((block, idx) => (
                    <div
                      key={block.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        block.isActive
                          ? "bg-[#16161a] border-zinc-800 hover:border-zinc-700"
                          : "bg-zinc-900/40 border-zinc-800/50 opacity-60"
                      }`}
                    >
                      {/* Left: Reorder & Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Order buttons */}
                        <div className="flex flex-col gap-0.5 text-zinc-500">
                          <button
                            onClick={() => moveBlock(idx, "up")}
                            disabled={idx === 0}
                            className="hover:text-white disabled:opacity-20 text-[10px] p-0.5 cursor-pointer"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveBlock(idx, "down")}
                            disabled={idx === data.blocks.length - 1}
                            className="hover:text-white disabled:opacity-20 text-[10px] p-0.5 cursor-pointer"
                          >
                            ▼
                          </button>
                        </div>

                        <span className="text-xl shrink-0">{block.icon || "🔗"}</span>

                        <div className="truncate">
                          <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 truncate">
                            <span className="truncate">{block.title}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 shrink-0">
                              {block.type}
                            </span>
                          </div>
                          {block.subtitle && (
                            <p className="text-[11px] text-zinc-400 truncate">{block.subtitle}</p>
                          )}
                        </div>
                      </div>

                      {/* Right: Clicks & Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] font-mono text-[#1ed760] bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-900/40">
                          {block.clicks || 0} clicks
                        </span>

                        {/* Active toggle */}
                        <button
                          onClick={() => toggleBlock(block.id)}
                          className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                            block.isActive ? "bg-[#1ed760]" : "bg-zinc-700"
                          }`}
                          title="공개 상태 토글"
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                              block.isActive ? "right-1" : "left-1"
                            }`}
                          ></span>
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => deleteBlock(block.id)}
                          className="text-zinc-500 hover:text-rose-400 text-xs p-1 cursor-pointer"
                          title="삭제"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: PROFILE & THEME */}
            {activeTab === "profile" && (
              <div className="space-y-6 max-w-xl">
                {/* Theme Selection */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white">🎨 테마 프리셋</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(
                      [
                        { id: "spotify-dark", name: "Spotify Dark", desc: "칠흑색 & Green", border: "border-[#1ed760]" },
                        { id: "github-dark", name: "GitHub Dark", desc: "깃허브 톤", border: "border-[#58a6ff]" },
                        { id: "monokai", name: "Monokai", desc: "코드 에디터", border: "border-[#a6e22e]" },
                        { id: "minimal-light", name: "Minimal Light", desc: "화이트 미니멀", border: "border-zinc-400" },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => updateData({ ...data, theme: t.id })}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                          data.theme === t.id
                            ? `bg-[#1c1c22] ${t.border} shadow-md`
                            : "bg-[#16161a] border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{t.name}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="space-y-4 pt-2 border-t border-zinc-800">
                  <h3 className="text-sm font-bold text-white">👤 기본 프로필 정보</h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400">핸들 (Username)</label>
                      <input
                        type="text"
                        value={data.user.username}
                        onChange={(e) =>
                          updateData({
                            ...data,
                            user: { ...data.user, username: e.target.value },
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-[#16161a] border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1ed760]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400">표시 이름 (Full Name)</label>
                      <input
                        type="text"
                        value={data.user.fullName}
                        onChange={(e) =>
                          updateData({
                            ...data,
                            user: { ...data.user, fullName: e.target.value },
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-[#16161a] border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1ed760]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400">직무 및 역할 (Role)</label>
                    <input
                      type="text"
                      value={data.user.role}
                      onChange={(e) =>
                        updateData({
                          ...data,
                          user: { ...data.user, role: e.target.value },
                        })
                      }
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[#16161a] border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1ed760]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400">한줄 소개 (Bio)</label>
                    <textarea
                      rows={3}
                      value={data.user.bio}
                      onChange={(e) =>
                        updateData({
                          ...data,
                          user: { ...data.user, bio: e.target.value },
                        })
                      }
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[#16161a] border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1ed760] leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400">아바타 (이모지 or URL)</label>
                      <input
                        type="text"
                        value={data.user.avatar}
                        onChange={(e) =>
                          updateData({
                            ...data,
                            user: { ...data.user, avatar: e.target.value },
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-[#16161a] border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1ed760]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400">이메일 링크</label>
                      <input
                        type="text"
                        value={data.socialLinks.email || ""}
                        onChange={(e) =>
                          updateData({
                            ...data,
                            socialLinks: { ...data.socialLinks, email: e.target.value },
                          })
                        }
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-[#16161a] border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#1ed760]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ANALYTICS */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white">방문자 및 클릭 통계</h2>
                  <p className="text-xs text-zinc-400">로컬스토리지에 저장된 실시간 인터랙션 데이터입니다.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#16161a] border border-zinc-800 space-y-1">
                    <span className="text-xs text-zinc-400">총 프로필 뷰 (PV)</span>
                    <div className="text-2xl font-black text-white">{data.pageViews || 0}</div>
                    <span className="text-[10px] text-emerald-400">▲ 실시간 증가</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#16161a] border border-zinc-800 space-y-1">
                    <span className="text-xs text-zinc-400">총 링크 클릭 수</span>
                    <div className="text-2xl font-black text-[#1ed760]">{totalClicks}</div>
                    <span className="text-[10px] text-zinc-400">링크당 평균 {(totalClicks / (data.blocks.length || 1)).toFixed(1)} 회</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#16161a] border border-zinc-800 space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-xs text-zinc-400">활성 블록 수</span>
                    <div className="text-2xl font-black text-white">
                      {data.blocks.filter((b) => b.isActive).length} / {data.blocks.length}
                    </div>
                    <span className="text-[10px] text-zinc-400">전체 블록 중 공개 비율</span>
                  </div>
                </div>

                {/* Clicks Ranking */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    인기 링크 랭킹 (Top Clicked Links)
                  </h3>

                  <div className="space-y-2">
                    {[...data.blocks]
                      .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                      .map((b, rank) => {
                        const percent = totalClicks > 0 ? ((b.clicks || 0) / totalClicks) * 100 : 0;
                        return (
                          <div key={b.id} className="p-3 rounded-lg bg-[#16161a] border border-zinc-800 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-white flex items-center gap-2">
                                <span className="text-zinc-500 font-mono text-[11px]">#{rank + 1}</span>
                                <span>{b.icon}</span>
                                <span>{b.title}</span>
                              </span>
                              <span className="font-bold text-[#1ed760]">{b.clicks || 0} clicks ({percent.toFixed(0)}%)</span>
                            </div>
                            {/* Bar */}
                            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#1ed760] rounded-full transition-all duration-300"
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right: Real-time Live Mobile Frame Preview */}
        <section className="w-full lg:w-[460px] xl:w-[480px] bg-[#121215] border-t lg:border-t-0 flex flex-col items-center justify-center p-4 sm:p-6 shrink-0 select-none">
          <div className="flex items-center gap-2 mb-3 text-xs text-zinc-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-zinc-200">실시간 모바일 라이브 프리뷰</span>
            <span>(Live WYSIWYG)</span>
          </div>

          {/* Smartphone Mockup */}
          <div className="relative w-[340px] h-[680px] bg-black rounded-[46px] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-4 border-zinc-800 flex flex-col overflow-hidden">
            {/* Phone Speaker Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-900 rounded-full z-50 flex items-center justify-center">
              <div className="w-10 h-1 bg-zinc-700 rounded-full"></div>
            </div>

            {/* Inner Phone Screen */}
            <div className="w-full h-full rounded-[36px] overflow-y-auto overflow-x-hidden pt-4 relative">
              <ProfileView data={data} isMobileFrame={true} />
            </div>
          </div>
        </section>
      </div>

      {/* Add Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#18181c] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">신규 콘텐츠 블록 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400">블록 종류</label>
                <select
                  value={newBlockType}
                  onChange={(e) => setNewBlockType(e.target.value as BlockType)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#121215] border border-zinc-800 text-xs text-white"
                >
                  <option value="link">일반 URL 링크</option>
                  <option value="github_repo">GitHub Pinned Repo 카드</option>
                  <option value="tech_stack">기술 스택 뱃지 클러스터</option>
                  <option value="project">프로젝트 쇼케이스 카드</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400">
                  {newBlockType === "tech_stack" ? "섹션 제목" : "제목 (Title)"}
                </label>
                <input
                  type="text"
                  placeholder="예: 최신 프로젝트 데모"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#121215] border border-zinc-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400">
                  {newBlockType === "tech_stack" ? "스택 목록 (쉼표 구분)" : "설명 (Subtitle)"}
                </label>
                <input
                  type="text"
                  placeholder={newBlockType === "tech_stack" ? "React, TypeScript, Next.js" : "예: 직관적인 AI 검색 서비스"}
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#121215] border border-zinc-800 text-xs text-white"
                />
              </div>

              {newBlockType !== "tech_stack" && (
                <div>
                  <label className="text-xs font-semibold text-zinc-400">URL 주소</label>
                  <input
                    type="text"
                    placeholder="https://"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[#121215] border border-zinc-800 text-xs text-white"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-zinc-400">대표 아이콘 (이모지)</label>
                <input
                  type="text"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="w-20 mt-1 px-3 py-2 rounded-lg bg-[#121215] border border-zinc-800 text-xs text-white text-center"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white"
              >
                취소
              </button>
              <button
                onClick={handleAddBlock}
                className="px-4 py-2 rounded-lg bg-[#1ed760] text-black font-bold text-xs hover:bg-[#1fdf64]"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
