"use client";

import * as React from "react";
import { Toast } from "@base-ui/react/toast";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Viewport className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2.5 p-4 outline-none sm:bottom-6 sm:right-6 pointer-events-none">
      {toasts.map((toastItem) => {
        const variant = (toastItem.type as ToastVariant | undefined) ?? "info";

        return (
          <Toast.Root
            key={toastItem.id}
            toast={toastItem}
            className={cn(
              "pointer-events-auto relative flex items-start gap-3 rounded-xl border bg-spotify-surface px-4 py-3.5 text-white shadow-[0_8px_24px_rgba(0,0,0,0.55)] transition-all duration-200",
              "data-[starting]:translate-y-2 data-[starting]:opacity-0",
              "data-[ending]:translate-y-2 data-[ending]:opacity-0",
              variant === "success" && "border-spotify-green/40",
              variant === "error" && "border-red-500/40",
              variant === "info" && "border-zinc-700"
            )}
          >
            <div className="mt-0.5 shrink-0">
              {variant === "success" && (
                <CheckCircle2 className="h-4 w-4 text-spotify-green" />
              )}
              {variant === "error" && (
                <AlertCircle className="h-4 w-4 text-[#f3727f]" />
              )}
              {variant === "info" && (
                <Info className="h-4 w-4 text-[#539df5]" />
              )}
            </div>

            <Toast.Content className="flex-1 space-y-0.5 pr-4">
              {toastItem.title && (
                <Toast.Title className="text-xs font-bold text-white leading-snug">
                  {toastItem.title}
                </Toast.Title>
              )}
              {toastItem.description && (
                <Toast.Description className="text-[11px] text-spotify-subtext leading-relaxed">
                  {toastItem.description}
                </Toast.Description>
              )}
            </Toast.Content>

            <Toast.Close
              aria-label="닫기"
              className="absolute right-2.5 top-2.5 rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </Toast.Close>
          </Toast.Root>
        );
      })}
    </Toast.Viewport>
  );
}

export function AppToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider timeout={3500} limit={4}>
      {children}
      <Toast.Portal>
        <ToastList />
      </Toast.Portal>
    </Toast.Provider>
  );
}

export function useAppToast() {
  const manager = Toast.useToastManager();
  const addRef = React.useRef(manager.add);

  React.useEffect(() => {
    addRef.current = manager.add;
  }, [manager.add]);

  return React.useMemo(
    () => ({
      success: (title: string, description?: string) =>
        addRef.current({ title, description, type: "success" }),
      error: (title: string, description?: string) =>
        addRef.current({ title, description, type: "error" }),
      info: (title: string, description?: string) =>
        addRef.current({ title, description, type: "info" }),
    }),
    []
  );
}
