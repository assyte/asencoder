"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import clsx from "clsx";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              "px-4 py-3 rounded-lg border backdrop-blur-md text-sm shadow-2xl transition-all",
              t.type === "success" &&
                "bg-emerald-950/40 border-emerald-500/30 text-emerald-200",
              t.type === "error" &&
                "bg-accent/15 border-accent/40 text-red-200",
              t.type === "info" &&
                "bg-surface2/90 border-border-strong text-text"
            )}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5">
                {t.type === "success"
                  ? "✓"
                  : t.type === "error"
                  ? "!"
                  : "i"}
              </span>
              <span className="leading-relaxed">{t.message}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
