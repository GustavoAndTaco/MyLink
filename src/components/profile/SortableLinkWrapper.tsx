"use client";

import { GripVertical, Pencil, Trash2 } from "lucide-react";

interface SortableLinkWrapperProps {
  id: string;
  index: number;
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

export default function SortableLinkWrapper({
  index,
  isDragging,
  isDragOver,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  onDragEnd,
  onEdit,
  onDelete,
  children,
}: SortableLinkWrapperProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(index));
        onDragStart(index);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        onDragEnter(index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        onDragOver(e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(index);
      }}
      onDragEnd={onDragEnd}
      className={`group/wrapper relative flex items-stretch gap-2 rounded-xl transition-all duration-150 ${
        isDragging ? "opacity-40 scale-[0.98]" : "opacity-100"
      } ${
        isDragOver && !isDragging
          ? "ring-2 ring-spotify-green ring-offset-2 ring-offset-spotify-black"
          : ""
      }`}
    >
      {/* 좌측 드래그 핸들 */}
      <div
        className="flex items-center justify-center px-1 rounded-lg text-zinc-600 hover:text-spotify-green cursor-grab active:cursor-grabbing transition-colors shrink-0"
        title="드래그하여 순서 변경"
        aria-label="드래그하여 링크 위치 이동"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* 실제 링크 카드 영역 */}
      <div className="flex-1 min-w-0 relative">
        {children}

        {/* 우측 상단 수정 / 삭제 툴바 */}
        <div className="absolute -top-2.5 right-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/wrapper:opacity-100 focus-within:opacity-100 transition-opacity duration-150 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit();
            }}
            className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 hover:border-spotify-green text-zinc-300 hover:text-spotify-green flex items-center justify-center shadow-md transition-colors"
            title="링크 수정"
            aria-label="링크 수정"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-red-400 flex items-center justify-center shadow-md transition-colors"
            title="링크 삭제"
            aria-label="링크 삭제"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
