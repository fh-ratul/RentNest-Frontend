import { ISidebarItem } from "@/lib/types";
import { Settings } from "lucide-react";
import { LANDLORD_SIDEBAR_ITEMS } from "./landlordSidebarItems";
import { ADMIN_SIDEBAR_ITEMS } from "./adminSidebarItems";
import { TENANT_SIDEBAR_ITEMS } from "./tanentSidebarItems";

const SETTINGS_ITEM: ISidebarItem = { label: "Settings", href: "/dashboard/settings", icon: Settings };

export const sidebarMenuItems: Record<string, ISidebarItem[]> = {
  TENANT: [...TENANT_SIDEBAR_ITEMS, SETTINGS_ITEM],
  LANDLORD: [...LANDLORD_SIDEBAR_ITEMS, SETTINGS_ITEM],
  ADMIN: [...ADMIN_SIDEBAR_ITEMS, SETTINGS_ITEM],
};