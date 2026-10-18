"use client";

import { usePathname } from "next/navigation";

// The dashboard has its own full-height shell, so site chrome like the footer stays out of it.
export function HideOnDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname.startsWith("/dashboard") ? null : children;
}
