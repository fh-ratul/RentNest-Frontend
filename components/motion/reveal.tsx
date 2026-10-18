"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type RevealProps = React.ComponentProps<"div"> & {
  /** Delay in ms before this element animates in, for staggering siblings. */
  delay?: number;
};

// Fades and lifts content in the first time it scrolls into view.
// The hidden state lives in globals.css and only applies when JS runs
// and the visitor hasn't asked for reduced motion.
export function Reveal({ delay = 0, className, style, children, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      className={cn(className)}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}
