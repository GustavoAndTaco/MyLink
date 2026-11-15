"use client";

import { BlockItem } from "@/types";
import { FolderGit2, Star, GitFork, ExternalLink, MousePointerClick } from "lucide-react";

interface GitHubRepoCardProps {
  block: BlockItem;
  onLinkClick?: () => void;
}

export default function GitHubRepoCard({ block, onLinkClick }: GitHubRepoCardProps) {
  const repo = block.pinnedRepo;

  return (
    <a
      href={block.url || "https://github.com"}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      onClick={() => onLinkClick?.()}
      className="group block p-4 rounded-xl bg-spotify-surface border border-spotify-border hover:border-spotify-border-hover hover:bg-spotify-elevated transition-all duration-200 shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-white">
          <FolderGit2 className="w-4 h-4 text-spotify-green" />
          <span className="group-hover:text-spotify-green transition-colors font-mono">
            {repo?.name || block.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {block.badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
              {block.badge}
            </span>
          )}
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-spotify-green transition-colors" />
        </div>
      </div>

      <p className="text-xs text-spotify-subtext mb-3 line-clamp-2 leading-relaxed">
        {repo?.description || block.subtitle}
      </p>

      <div className="flex items-center gap-4 text-[11px] text-spotify-subtext font-mono">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: repo?.languageColor || "#3178c6" }}
          />
          <span className="text-zinc-300">{repo?.language || "TypeScript"}</span>
        </span>
        <span className="flex items-center gap-1 text-zinc-400 group-hover:text-zinc-200 transition-colors">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500/20" />
          {repo?.stars?.toLocaleString() ?? 0}
        </span>
        <span className="flex items-center gap-1 text-zinc-400 group-hover:text-zinc-200 transition-colors">
          <GitFork className="w-3 h-3 text-zinc-400" />
          {repo?.forks?.toLocaleString() ?? 0}
        </span>
        <span
          className="ml-auto flex items-center gap-1 text-spotify-subtext"
          title="누적 클릭수"
        >
          <MousePointerClick className="w-3 h-3 text-spotify-green" />
          <span>{(block.clickCount ?? 0).toLocaleString()}</span>
        </span>
      </div>
    </a>
  );
}
