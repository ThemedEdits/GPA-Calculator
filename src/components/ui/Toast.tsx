"use client";

import { useToastStore } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-0 sm:top-auto sm:bottom-0 left-0 right-0 z-[100] flex flex-col p-4 sm:p-6 gap-2 items-center sm:items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div 
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "flex w-full sm:w-auto max-w-sm items-center justify-between space-x-4 rounded-[var(--radius-md)] p-4 shadow-lg border pointer-events-auto",
              {
                "bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--text-primary)]": toast.type === "info",
                "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300": toast.type === "success",
                "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300": toast.type === "error",
              }
            )}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && <CheckCircle className="h-5 w-5" />}
              {toast.type === "error" && <AlertCircle className="h-5 w-5" />}
              {toast.type === "info" && <Info className="h-5 w-5 text-[var(--text-secondary)]" />}
              <div className="text-sm font-medium">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
