import { GraduationCap } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--background)]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute -inset-4 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin duration-1000"></div>
          
          {/* Inner pulsating icon */}
          <div className="bg-[var(--accent)] text-[var(--accent-foreground)] p-4 rounded-full shadow-lg shadow-[var(--accent)]/20 animate-pulse">
            <GraduationCap className="w-8 h-8" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <p className="text-[var(--text-primary)] font-bold tracking-widest uppercase text-sm">
            Loading
          </p>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
