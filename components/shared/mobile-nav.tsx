"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo";
import { isActiveLink, NavLinkItem } from "./nav-shell";

export default function MobileNav({ links, isLoggedIn }: { links: NavLinkItem[]; isLoggedIn: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] max-w-xs gap-0 p-0">
        <SheetHeader className="border-b p-5">
          <SheetTitle className="flex items-center gap-2.5 font-heading text-lg">
            <LogoMark /> RentNest
          </SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 p-3" aria-label="Mobile">
          {links.map((link, i) => {
            const active = isActiveLink(pathname, link);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${80 + i * 50}ms` }}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors animate-in fade-in slide-in-from-right-4 fill-mode-both duration-500",
                  active ? "bg-accent text-accent-foreground" : "text-foreground/80 hover:bg-muted"
                )}
              >
                {link.label}
                <ArrowRight className={cn("size-4 transition-opacity", active ? "opacity-100" : "opacity-30")} />
              </Link>
            );
          })}
        </nav>

        {!isLoggedIn && (
          <div className="mt-auto grid gap-2 border-t p-4">
            <Button asChild variant="outline" size="lg" onClick={() => setOpen(false)}>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="lg" onClick={() => setOpen(false)}>
              <Link href="/register">Create an account</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
