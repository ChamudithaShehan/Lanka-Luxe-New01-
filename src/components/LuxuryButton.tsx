import React, { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export interface LuxuryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "pill" | "outline" | "ghost" | "dark" | "secondary";
  size?: "sm" | "md" | "lg";
  href?: string;
  withArrow?: boolean;
  isExternal?: boolean;
  children: React.ReactNode;
}

export const LuxuryButton = forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  (
    {
      className,
      variant = "pill",
      size = "md",
      href,
      withArrow = true,
      isExternal = false,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-300 select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer";

    const sizeStyles = {
      sm: "text-xs px-4 py-2 gap-2 rounded-full",
      md: "text-sm px-6 py-3 gap-3 rounded-full",
      lg: "text-sm px-7 py-3.5 gap-3.5 rounded-full",
    };

    const variantStyles = {
      pill: "bg-[#0B1F3A] text-white hover:bg-[#08172b] shadow-sm hover:shadow-md active:translate-y-px font-medium",
      gold: "bg-[#C8A45D] text-[#0B1F3A] hover:bg-[#b5924d] shadow-md hover:shadow-lg hover:shadow-[#C8A45D]/20 active:translate-y-px font-semibold uppercase tracking-wider text-xs",
      dark: "bg-navy text-white hover:bg-navy-2 shadow-sm hover:shadow-md active:translate-y-px font-medium",
      outline:
        "border border-slate-300 hover:border-navy text-navy hover:bg-slate-50 active:translate-y-px font-medium",
      ghost: "text-[#0B1F3A] hover:text-[#C8A45D] hover:bg-slate-100 active:translate-y-px",
      secondary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 active:translate-y-px font-medium",
    };

    const content = (
      <>
        <span>{children}</span>
        {withArrow && (
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </span>
        )}
      </>
    );

    if (href) {
      if (
        isExternal ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("https://wa.me")
      ) {
        return (
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
          >
            {content}
          </a>
        );
      }
      return (
        <Link
          href={href}
          className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {content}
      </button>
    );
  },
);

LuxuryButton.displayName = "LuxuryButton";
