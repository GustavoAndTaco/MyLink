"use client";

import { useState } from "react";
import { Heart, Play, Pause, Terminal } from "lucide-react";

interface NowPlayingBarProps {
  role: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function NowPlayingBar({
  role,
  isPlaying,
  onTogglePlay,
}: NowPlayingBarProps) {
  const [isLiked, setIsLiked] = useState(true);

  return (
    <aside className="fixed bottom-0 left-0 right-0 h-16 bg-spotify-surface/95 backdrop-blur-md border-t border-spotify-border z-40 px-4 sm:px-6 flex items-center justify-between select-none text-xs">
      {/* 트랙 정보 */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-md bg-gradient-to-br from-spotify-green/80 to-zinc-900 flex items-center justify-center shrink-0 shadow-sm border border-spotify-green/20">
          <Terminal className="w-5 h-5 text-black" />
        </div>
        <div className="truncate">
          <div className="font-bold text-white truncate text-xs flex items-center gap-1.5">
            <span>Building The Next Web</span>
            <span className="w-1.5 h-1.5 rounded-full bg-spotify-green inline-block animate-ping"></span>
          </div>
          <div className="text-[11px] text-spotify-subtext truncate font-mono">
            {role}
          </div>
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`cursor-pointer ml-1 p-1 rounded-full hover:scale-110 transition-transform ${
            isLiked ? "text-spotify-green" : "text-zinc-600 hover:text-zinc-400"
          }`}
          title={isLiked ? "Unlike" : "Like"}
          aria-label="좋아요 토글"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* 미니 컨트롤러 & 재생 진행률 */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
          <span>01:42</span>
          <div className="w-24 sm:w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="w-2/5 h-full bg-white rounded-full transition-all"></div>
          </div>
          <span>03:45</span>
        </div>
        <button
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs hover:scale-105 active:scale-95 transition-transform shadow-sm"
          title={isPlaying ? "Pause" : "Play"}
          aria-label={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>
      </div>
    </aside>
  );
}
