import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavbarProps } from "@/lib/types";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "./logo";
import { NavShell, NavLinks } from "./nav-shell";
import { HideOnDashboard } from "./hide-on-dashboard";
import MobileNav from "./mobile-nav";
import UserMenu from "./user-menu";

const ROLE_DASHBOARD: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export function Navbar({ user }: NavbarProps) {
  const isLoggedIn = Boolean(user?.success && user.data);
  const dashboardHref = isLoggedIn ? ROLE_DASHBOARD[user.data!.role] || "/" : null;

  const links = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Browse homes" },
    { href: "/#landlords", label: "For landlords", match: "/#landlords" },
    ...(dashboardHref ? [{ href: dashboardHref, label: "Dashboard", match: "/dashboard" }] : []),
  ];

  return (
    <>
      <HideOnDashboard>
        <div className="hidden bg-[var(--navy)] text-[oklch(0.86_0.01_85)] md:block">
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs sm:px-6">
            <p className="flex items-center gap-2">
              <MapPin className="size-3.5 text-brass" />
              Verified rental homes in Dhaka, Chattogram and Sylhet
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-brass" />
              Payments secured by Stripe
            </p>
          </div>
        </div>
      </HideOnDashboard>

      <NavShell>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-10">
            <Logo compact />
            <NavLinks links={links} className="hidden md:flex" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />

            {isLoggedIn ? (
              <UserMenu name={user.data!.name} email={user.data!.email} role={user.data!.role} />
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button asChild variant="ghost" size="sm" className="font-medium">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="h-9 px-4">
                  <Link href="/register">Get started</Link>
                </Button>
              </div>
            )}

            <MobileNav links={links} isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </NavShell>
    </>
  );
}
