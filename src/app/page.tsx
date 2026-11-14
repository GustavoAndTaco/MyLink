"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProfileData, ThemeType } from "@/types";
import {
  getProfileData,
  saveProfileData,
  incrementBlockClick,
  incrementPageView,
} from "@/lib/storage";
import { initialProfileData } from "@/lib/mockData";
import ProfileView from "@/components/ProfileView";

export default function Home() {
  const [data, setData] = useState<ProfileData>(initialProfileData);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    incrementPageView();
    const current = getProfileData();
    setData(current);

    const handleUpdate = () => {
      setData(getProfileData());
    };

    window.addEventListener("mylink_storage_update", handleUpdate);
    return () => {
      window.removeEventListener("mylink_storage_update", handleUpdate);
    };
  }, []);

  const handleThemeChange = (newTheme: ThemeType) => {
    const updated = { ...data, theme: newTheme };
    setData(updated);
    saveProfileData(updated);
  };

  const handleBlockClick = (block: { id: string }) => {
    incrementBlockClick(block.id);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white font-mono text-sm">
        MyLink 로딩 중...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Top Floating Admin & Theme Quick Switcher Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#181818]/90 backdrop-blur-md border-b border-[#282828] px-4 py-2.5 flex items-center justify-between text-xs text-zinc-300 shadow-md">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1ed760] text-black font-black text-xs">
            ≈
          </span>
          <span className="font-bold text-white tracking-tight">
            MyLink <span className="text-zinc-500 font-normal">(@{data.user.username})</span>
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
            Client Demo Mode
          </span>
        </div>

        {/* Quick Theme Switcher & Admin Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1 bg-[#121212] p-1 rounded-lg border border-[#282828]">
            {(
              [
                { id: "spotify-dark", label: "Spotify" },
                { id: "github-dark", label: "GitHub" },
                { id: "monokai", label: "Monokai" },
                { id: "minimal-light", label: "Light" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                  data.theme === t.id
                    ? "bg-[#1ed760] text-black font-bold shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-xs tracking-tight shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>⚙️</span>
            <span>관리자 대시보드</span>
          </Link>
        </div>
      </header>

      {/* Main Public Profile View */}
      <div className="flex-1 w-full">
        <ProfileView data={data} onBlockClick={handleBlockClick} />
      </div>
    </div>
  );
}
