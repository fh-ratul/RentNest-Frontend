"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  tenant: "Tenant",
  landlord: "Landlord",
  admin: "Admin",
  properties: "Properties",
  requests: "Requests",
  users: "Users",
  rentals: "Rentals",
  settings: "Settings",
  new: "New",
  edit: "Edit",
  pay: "Payment",
  review: "Review",
};

// Turns /dashboard/landlord/properties/abc123/edit into readable crumbs,
// skipping ids that don't have a label.
function useCrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments
    .map((segment, i) => ({ label: SEGMENT_LABELS[segment], href: "/" + segments.slice(0, i + 1).join("/") }))
    .filter((crumb): crumb is { label: string; href: string } => Boolean(crumb.label))
    .slice(1);
}

export default function DashboardTopbar({ role }: { role: string }) {
  const crumbs = useCrumbs();
  const home = `/dashboard/${role.toLowerCase()}`;

  return (
    <div className="sticky top-16 z-20 border-b bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <SidebarTrigger className="-ml-1.5 rounded-full" />
        <Separator orientation="vertical" className="mx-1 h-4!" />
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
          <Link href={home} className="text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex min-w-0 items-center gap-1">
              <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" />
              {i === crumbs.length - 1 ? (
                <span className="truncate font-medium" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="truncate text-muted-foreground transition-colors hover:text-foreground">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
