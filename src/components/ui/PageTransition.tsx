"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import Link, { LinkProps } from "next/link";

const TransitionContext = createContext({
  navigate: (href: string) => {},
});

export const usePageTransition = () => useContext(TransitionContext);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Hide loader when pathname changes (meaning route is fully loaded)
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const navigate = (href: string) => {
    if (pathname === href) return;
    setIsNavigating(true);
    setTimeout(() => {
      router.push(href);
    }, 600); // Wait for loader animation to cover screen
  };

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-[var(--background)] flex items-center justify-center border-t-4 border-[var(--accent)]"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className="absolute -inset-4 border-2 border-[var(--border)] border-t-[var(--text-primary)] rounded-full animate-spin duration-1000"></div>
                <div className="bg-[var(--surface-elevated)] text-[var(--text-primary)] p-4 rounded-full shadow-lg shadow-[var(--shadow-custom)]">
                  <GraduationCap className="w-10 h-10" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-[var(--text-primary)] font-bold tracking-widest uppercase text-sm">
                  Computing
                </p>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

interface TransitionLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  children: React.ReactNode;
}

export function TransitionLink({ href, children, className, onClick, ...props }: TransitionLinkProps) {
  const { navigate } = usePageTransition();
  
  return (
    <Link 
      href={href} 
      className={className} 
      onClick={(e) => {
        e.preventDefault();
        navigate(href.toString());
        if (onClick) onClick(e);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
