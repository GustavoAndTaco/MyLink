"use client";

import { BlockItem } from "@/types";
import { Cpu, Layers } from "lucide-react";

interface TechStackCardProps {
  block: BlockItem;
}

export default function TechStackCard({ block }: TechStackCardProps) {
  const stack = block.techStack || [];

  return (
    <div className="p-4 rounded-xl bg-spotify-surface border border-spotify-border shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-xs text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-spotify-green" />
          <span>{block.title}</span>
        </span>
        <span className="text-[10px] text-spotify-subtext font-mono flex items-center gap-1">
          <Layers className="w-3 h-3" />
          {stack.length} Stacks
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {stack.map((item) => (
          <span
            key={item}
            className="text-xs px-2.5 py-1 rounded-lg font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 hover:border-spotify-green/50 hover:text-spotify-green hover:bg-zinc-800 transition-colors duration-150 select-text"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
