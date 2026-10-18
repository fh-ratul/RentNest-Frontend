"use client";

import { useEffect, useRef, useState } from "react";

type Props = { value: number; prefix?: string; suffix?: string; duration?: number };

// Counts from 0 to `value` once it scrolls into view. Server-renders the
// final number so the value is correct without JS and for crawlers.
export function CountUp({ value, prefix = "", suffix = "", duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        setDisplay(Math.round(value * eased));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      setDisplay(0);
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
