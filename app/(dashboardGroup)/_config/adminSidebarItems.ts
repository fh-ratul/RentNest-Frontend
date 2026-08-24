import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard, Users, Building2, ClipboardList } from "lucide-react";

export const ADMIN_SIDEBAR_ITEMS: ISidebarItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Properties", href: "/dashboard/admin/properties", icon: Building2 },
  { label: "Rentals", href: "/dashboard/admin/rentals", icon: ClipboardList },
];