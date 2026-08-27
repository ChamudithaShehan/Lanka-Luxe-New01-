import React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  theme?: "dark" | "light";
  action?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  theme = "light",
  action,
}: SectionHeaderProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center mx-auto max-w-3xl",
        align === "left" && "text-left max-w-2xl",
        align === "right" && "text-right ml-auto max-w-2xl",
        className,
      )}
    >
      <Reveal variant="fade-up">
        {eyebrow && (
          <div
            className={cn(
              "flex items-center gap-2.5 mb-3",
              align === "center" && "justify-center",
              align === "right" && "justify-end",
            )}
          >
            <span
              className={cn(
                "text-xs font-semibold tracking-[0.25em] uppercase",
                isDark ? "text-gold" : "text-[#C8A45D]",
              )}
            >
              {eyebrow}
            </span>
          </div>
        )}

        <div
          className={cn(
            action &&
              "flex flex-col md:flex-row md:items-end md:justify-between gap-6",
          )}
        >
          <div>
            <h2
              className={cn(
                "text-3xl sm:text-4xl md:text-5xl font-display font-medium leading-[1.15] tracking-tight",
                isDark ? "text-white" : "text-[#081A33]",
              )}
            >
              {title}
            </h2>

            {subtitle && (
              <p
                className={cn(
                  "mt-4 text-sm sm:text-base md:text-lg font-sans leading-relaxed",
                  isDark ? "text-mist" : "text-slate-600",
                  align === "center" && "mx-auto max-w-2xl",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>

          {action && <div className="shrink-0 mt-4 md:mt-0">{action}</div>}
        </div>
      </Reveal>
    </div>
  );
}
