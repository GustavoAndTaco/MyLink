"use client";

import { BlockItem } from "@/types";
import { Rocket, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";

interface ProjectCardProps {
  block: BlockItem;
}

export default function ProjectCard({ block }: ProjectCardProps) {
  const proj = block.project;

  return (
    <div className="p-4 rounded-xl bg-spotify-surface border border-spotify-border hover:border-spotify-border-hover transition-all duration-200 shadow-md space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <Rocket className="w-4 h-4 text-spotify-green shrink-0" />
            <span>{block.title}</span>
          </h3>
          {block.subtitle && (
            <p className="text-xs text-spotify-subtext mt-1 leading-relaxed">
              {block.subtitle}
            </p>
          )}
        </div>
        {block.badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 shrink-0">
            {block.badge}
          </span>
        )}
      </div>

      {proj?.tags && proj.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {proj.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/40 text-zinc-400 border border-zinc-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        {proj?.demoUrl && (
          <a
            href={proj.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold bg-spotify-green hover:bg-spotify-green-hover text-black transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <span>Live Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        {proj?.githubUrl && (
          <a
            href={proj.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold border border-zinc-700 hover:border-white text-white hover:bg-white/5 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub Code</span>
          </a>
        )}
      </div>
    </div>
  );
}
