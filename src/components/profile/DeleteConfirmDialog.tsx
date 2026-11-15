"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  targetTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  targetTitle,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="링크 삭제 확인"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">링크 삭제</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                정말로 삭제하시겠습니까?
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors shrink-0"
            aria-label="닫기"
          >
            <X className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {targetTitle && (
          <div className="px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 truncate">
            <span className="text-zinc-500 mr-1.5">대상:</span>
            <span className="font-semibold text-white">{targetTitle}</span>
          </div>
        )}

        <p className="text-[11px] text-zinc-500">
          삭제된 링크는 데이터베이스에서 영구적으로 제거되며 복구할 수 없습니다.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-full text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>삭제하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
