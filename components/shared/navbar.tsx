import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavbarProps } from "@/lib/types";
import { Home } from "lucide-react";
import UserMenu from "./user-menu";

const ROLE_DASHBOARD: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export function Navbar({ user }: NavbarProps) {
  const isLoggedIn = Boolean(user?.success && user.data);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 text-lg font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
          </span>
          <span className="max-[360px]:hidden">RentNest</span>
        </Link>

        <nav className="flex min-w-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/properties">Browse</Link>
          </Button>

          {isLoggedIn ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href={ROLE_DASHBOARD[user.data!.role] || "/"}>Dashboard</Link>
              </Button>
              <UserMenu name={user.data!.name} email={user.data!.email} role={user.data!.role} />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="max-[380px]:hidden">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
