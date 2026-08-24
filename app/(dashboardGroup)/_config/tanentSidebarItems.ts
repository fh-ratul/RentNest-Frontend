import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard } from "lucide-react";

export const TENANT_SIDEBAR_ITEMS: ISidebarItem[] = [
  { label: "My Requests", href: "/dashboard/tenant", icon: LayoutDashboard },
];