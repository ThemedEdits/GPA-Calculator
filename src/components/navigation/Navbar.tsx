"use client";

import Link from "next/link";
import { GraduationCap, Menu, Moon, Sun, X, Calculator, LayoutDashboard, Settings } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "../ui/Button";

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
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] transition-colors"
            aria-label="Toggle Theme"
          >
            {mounted ? (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />) : <div className="w-5 h-5" />}
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
        <div className="flex items-center gap-2 md:hidden">
           <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] transition-colors"
          >
            {mounted ? (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />) : <div className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[var(--text-primary)]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] absolute w-full left-0 py-4 px-4 flex flex-col gap-4 shadow-[var(--shadow-custom)]">
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
      )}
    </header>
  );
}
