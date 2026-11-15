"use client";

import { BlockItem } from "@/types";
import { ArrowUpRight } from "lucide-react";

interface LinkCardProps {
  block: BlockItem;
}

export default function LinkCard({ block }: LinkCardProps) {
  return (
    <a
      href={block.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between p-4 rounded-xl bg-spotify-surface border border-spotify-border hover:border-spotify-border-hover hover:bg-spotify-elevated transition-all duration-200 shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-3">
        <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform duration-200">
          {block.icon || "🔗"}
        </span>
        <div className="truncate">
          <div className="font-semibold text-sm text-white truncate group-hover:text-spotify-green transition-colors">
            {block.title}
          </div>
          {block.subtitle && (
            <div className="text-xs truncate text-spotify-subtext mt-0.5">
              {block.subtitle}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        {block.badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            {block.badge}
          </span>
        )}
        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-spotify-green group-hover:bg-spotify-green group-hover:text-black transition-all duration-200">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </a>
  );
}
