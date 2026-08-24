"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import LogoutButton from "@/components/shared/logout-button";
import { ISidebarItem } from "@/lib/types";
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
  const navItems: ISidebarItem[] = sidebarMenuItems[role] ?? [];
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <Sidebar collapsible="none" className="h-full border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <Badge variant="secondary" className="mt-3 w-fit">
          {ROLE_LABEL[role] ?? role}
        </Badge>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="gap-3 rounded-lg data-[active=true]:bg-primary data-[active=true]:font-medium data-[active=true]:text-primary-foreground"
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
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

      <SidebarFooter className="border-t p-3">
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}