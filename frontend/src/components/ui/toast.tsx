"use client";

import * as React from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import { CheckCircle2, XCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error";

type ToastItem = {
  id: number;
  title: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (title: string, variant?: ToastVariant) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const idRef = React.useRef(0);

  const showToast = React.useCallback(
    (title: string, variant: ToastVariant = "success") => {
      idRef.current += 1;
      const id = idRef.current;
      setToasts((current) => [...current, { id, title, variant }]);
    },
    []
  );

  const dismiss = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastPrimitive.Provider swipeDirection="right" duration={3500}>
        {children}

        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            onOpenChange={(open) => {
              if (!open) dismiss(toast.id);
            }}
            className={cn(
              "flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-80",
              toast.variant === "success"
                ? "border-green-200"
                : "border-red-200"
            )}
          >
            {toast.variant === "success" ? (
              <CheckCircle2 size={18} className="shrink-0 text-green-600" />
            ) : (
              <XCircle size={18} className="shrink-0 text-red-600" />
            )}

            <ToastPrimitive.Title className="text-sm font-medium text-[#0F172A]">
              {toast.title}
            </ToastPrimitive.Title>

            <ToastPrimitive.Close className="ml-auto text-[#94A3B8] hover:text-[#0F172A]">
              <X size={14} />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}

        <ToastPrimitive.Viewport className="fixed bottom-6 right-6 z-[100] flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
