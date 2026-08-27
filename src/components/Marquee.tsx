import { motion } from "motion/react";

interface MarqueeProps {
  items: string[];
  speed?: number;
  className?: string;
}

export function Marquee({ items, speed = 30, className = "" }: MarqueeProps) {
  // Join items with a separator and repeat a few times to ensure it covers wide screens
  const content = items.join(" ✽ ");
  const repeatedContent = `${content} ✽ ${content} ✽ ${content} ✽ ${content}`;

  return (
    <div className={`flex overflow-hidden whitespace-nowrap select-none pointer-events-none relative w-full ${className}`}>
      {/* Subtle fade edges for the scrolling effect */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />
      
      <motion.div
        className="flex gap-12 md:gap-16 pr-12 md:pr-16 items-center min-w-max"
        style={{ willChange: "transform" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
      >
        <span className="text-5xl md:text-7xl lg:text-[7rem] font-sans font-bold text-slate-100 uppercase tracking-tight">
          {repeatedContent}
        </span>
        <span className="text-5xl md:text-7xl lg:text-[7rem] font-sans font-bold text-slate-100 uppercase tracking-tight">
          {repeatedContent}
        </span>
      </motion.div>
    </div>
  );
}
