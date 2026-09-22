import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]": variant === "primary",
            "bg-[var(--surface-elevated)] text-[var(--text-primary)] hover:bg-[var(--border)]": variant === "secondary",
            "border border-[var(--border)] bg-transparent hover:bg-[var(--surface-elevated)] text-[var(--text-primary)]": variant === "outline",
            "bg-transparent hover:bg-[var(--surface-elevated)] text-[var(--text-primary)]": variant === "ghost",
            "bg-[var(--danger)] text-white hover:bg-red-600": variant === "danger",
            "h-9 px-3 text-sm": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-11 px-8 text-lg": size === "lg",
            "h-10 w-10 p-2": size === "icon",
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
