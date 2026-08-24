import Link from "next/link";
import { Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-3.5 w-3.5" />
          </span>
          RentNest
        </Link>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} RentNest. Built for AIUB Assignment 5.
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/properties" className="hover:text-foreground">Browse</Link>
          <Link href="/login" className="hover:text-foreground">Log in</Link>
        </div>
      </div>
    </footer>
  );
}