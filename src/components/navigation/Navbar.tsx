"use client";

import Link from "next/link";
import { GraduationCap, Menu, Moon, Sun, X, Calculator, LayoutDashboard, Settings } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = !!user; 

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[var(--accent)] text-white p-1.5 rounded-[var(--radius-sm)] group-hover:bg-[var(--accent-hover)] transition-colors">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">GPA Calc</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5">
            <Calculator className="w-4 h-4" />
            Calculator
          </Link>
          {isAuthenticated && (
            <Link href="/dashboard" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
          <Link href="/grade-scale" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Grade Scale
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {/* Desktop Theme Slider */}
          <button
            onClick={toggleTheme}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--surface-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] border border-[var(--border)]"
            aria-label="Toggle Theme"
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-[var(--accent)] transition-transform duration-300 ease-in-out flex items-center justify-center",
                theme === "dark" ? "translate-x-6" : "translate-x-1"
              )}
            >
              {mounted && theme === "dark" ? (
                <Moon className="w-2.5 h-2.5 text-[var(--accent-foreground)]" />
              ) : mounted ? (
                <Sun className="w-2.5 h-2.5 text-[var(--accent-foreground)]" />
              ) : null}
            </span>
          </button>
          
          {isAuthenticated ? (
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary">Sign up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Mobile Theme Slider */}
          <button
            onClick={toggleTheme}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--surface-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] border border-[var(--border)]"
            aria-label="Toggle Theme"
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-[var(--accent)] transition-transform duration-300 ease-in-out flex items-center justify-center",
                theme === "dark" ? "translate-x-6" : "translate-x-1"
              )}
            >
              {mounted && theme === "dark" ? (
                <Moon className="w-2.5 h-2.5 text-[var(--accent-foreground)]" />
              ) : mounted ? (
                <Sun className="w-2.5 h-2.5 text-[var(--accent-foreground)]" />
              ) : null}
            </span>
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 text-[var(--text-primary)]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div 
        className={cn(
          "md:hidden absolute w-full left-0 bg-[var(--surface)] shadow-[var(--shadow-custom)] border-b border-[var(--border)] transition-all duration-300 ease-in-out overflow-hidden",
          isMobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 border-b-0"
        )}
      >
        <div className="py-4 px-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 hover:bg-[var(--surface-elevated)] rounded-[var(--radius-md)] flex items-center gap-2 font-medium">
            <Calculator className="w-5 h-5" /> Calculator
          </Link>
          {isAuthenticated && (
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 hover:bg-[var(--surface-elevated)] rounded-[var(--radius-md)] flex items-center gap-2 font-medium">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>
          )}
          <Link href="/grade-scale" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 hover:bg-[var(--surface-elevated)] rounded-[var(--radius-md)] font-medium">
            Grade Scale
          </Link>
          
          <div className="border-t border-[var(--border)] pt-4 mt-2 flex flex-col gap-2">
            {isAuthenticated ? (
               <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                 <Button variant="outline" className="w-full justify-start">Settings</Button>
               </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
