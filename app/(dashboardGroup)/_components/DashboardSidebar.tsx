"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import LogoutButton from "@/components/shared/logout-button";
import { UserAvatar } from "@/components/shared/user-menu";
import { ISidebarItem } from "@/lib/types";
import { ROLE_TONE, TONES } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { Compass } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarMenuItems } from "../_config/sidebarMenuItems";

type Props = { role: string; name: string; email: string };

const ROLE_LABEL: Record<string, string> = {
  TENANT: "Tenant",
  LANDLORD: "Landlord",
  ADMIN: "Admin",
};

export default function DashboardSidebar({ role, name, email }: Props) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const navItems: ISidebarItem[] = sidebarMenuItems[role] ?? [];

  // An item is active on its own page and on pages nested under it,
  // unless a more specific item matches.
  const activeHref = navItems
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <Sidebar className="top-16 h-[calc(100svh-4rem)]">
      <SidebarHeader className="p-3">
        <div className="relative overflow-hidden rounded-xl border bg-card p-3">
          <div className="relative flex items-center gap-3">
            <UserAvatar name={name} className="size-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
          <span
            className={cn(
              "relative mt-3 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold",
              TONES[ROLE_TONE[role] ?? "neutral"]
            )}
          >
            {ROLE_LABEL[role] ?? role}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-[0.14em]">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive = item.href === activeHref;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "relative h-10 gap-3 rounded-xl font-medium text-sidebar-foreground/70 transition-all duration-200",
                        "data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:hover:bg-primary/15 data-[active=true]:hover:text-primary"
                      )}
                    >
                      <Link href={item.href} onClick={() => setOpenMobile(false)}>
                        {isActive && (
                          <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-brass animate-in fade-in slide-in-from-left-1 duration-300" />
                        )}
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-1 border-t p-3">
        <SidebarMenuButton asChild className="h-10 gap-3 rounded-xl text-sidebar-foreground/70">
          <Link href="/properties" onClick={() => setOpenMobile(false)}>
            <Compass className="size-4" />
            <span>Browse homes</span>
          </Link>
        </SidebarMenuButton>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
