import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, motion } from "motion/react";

interface CounterProps {
  value: number;
  direction?: "up" | "down";
}

export function Counter({ value, direction = "up" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === "down" ? 0 : value);
    } else {
      // Reset when scrolling out of view to re-trigger on next scroll
      motionValue.set(direction === "down" ? value : 0);
    }
  }, [motionValue, isInView, value, direction]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(
          Math.floor(latest)
        );
      }
    });
  }, [springValue]);

  return <span ref={ref} />;
}
