import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard, Building2, ClipboardList } from "lucide-react";

export const LANDLORD_SIDEBAR_ITEMS: ISidebarItem[] = [
  { label: "Overview", href: "/dashboard/landlord", icon: LayoutDashboard },
  { label: "My Properties", href: "/dashboard/landlord/properties", icon: Building2 },
  { label: "Requests", href: "/dashboard/landlord/requests", icon: ClipboardList },
];