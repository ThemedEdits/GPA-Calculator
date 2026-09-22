"use client";

import { useToastStore } from "@/hooks/useToast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 w-80 p-4 rounded-[var(--radius-md)] shadow-[var(--shadow-custom)] border animate-in slide-in-from-bottom-5 fade-in duration-300 ${
            toast.type === 'success' ? 'bg-[var(--surface-elevated)] border-[var(--success)] text-[var(--success)]' :
            toast.type === 'error' ? 'bg-[var(--surface-elevated)] border-[var(--danger)] text-[var(--danger)]' :
            'bg-[var(--surface-elevated)] border-[var(--info)] text-[var(--info)]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
          
          <p className="text-sm font-medium text-[var(--text-primary)] flex-1">{toast.message}</p>
          
          <button onClick={() => removeToast(toast.id)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
