"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type NavLinkItem = { href: string; label: string; match?: string };

export function isActiveLink(pathname: string, { href, match }: NavLinkItem) {
  const base = match ?? href;
  return base === "/" ? pathname === "/" : pathname === base || pathname.startsWith(`${base}/`);
}

// Sticky header with a hairline; it gains a soft shadow once the page scrolls.
export function NavShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      data-scrolled={scrolled}
      className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md transition-shadow duration-300 data-[scrolled=true]:shadow-[0_10px_30px_-18px_hsl(var(--shadow-color)/0.35)]"
    >
      {children}
    </header>
  );
}

export function NavLinks({ links, className }: { links: NavLinkItem[]; className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("items-center gap-1", className)} aria-label="Main">
      {links.map((link) => {
        const active = isActiveLink(pathname, link);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative px-3 py-2 text-sm font-medium transition-colors duration-200",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-3 -bottom-px h-px origin-left bg-brass transition-transform duration-300 ease-(--ease-out-expo)",
                active ? "scale-x-100" : "scale-x-0"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
