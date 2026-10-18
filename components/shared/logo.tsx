import Link from "next/link";
import { cn } from "@/lib/utils";

// Brass on midnight in light mode, inverted to midnight on champagne in dark mode.
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-md bg-[oklch(0.27_0.055_258)] text-[oklch(0.8_0.09_80)] ring-1 ring-inset ring-white/10 dark:bg-[oklch(0.82_0.08_80)] dark:text-[oklch(0.22_0.04_258)]",
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[60%]">
        <path d="M4 11 12 4.5l8 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 13.2c1.4 3.5 3.3 5.3 5.5 5.3s4.1-1.8 5.5-5.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="11.6" r="1.5" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Logo({ className, compact, inverted }: { className?: string; compact?: boolean; inverted?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="RentNest home"
      className={cn(
        "flex shrink-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        className
      )}
    >
      <LogoMark />
      <span
        className={cn(
          "font-heading text-[1.4rem] font-medium leading-none tracking-[-0.02em]",
          inverted && "text-[oklch(0.97_0.006_85)]",
          compact && "max-[360px]:hidden"
        )}
      >
        RentNest
      </span>
    </Link>
  );
}
