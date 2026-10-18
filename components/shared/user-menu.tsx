"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logout } from "@/service/logout";
import { cn } from "@/lib/utils";
import { ROLE_TONE, TONES } from "@/lib/tones";

const ROLE_DASHBOARD: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

type Props = { name: string; email: string; role: string };

export function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export function UserAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <Avatar className={cn("size-9 ring-2 ring-background", className)}>
      <AvatarFallback className="bg-primary text-xs font-semibold tracking-wide text-primary-foreground">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

export default function UserMenu({ name, email, role }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className="group flex items-center gap-1.5 rounded-full p-0.5 pr-2 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 data-[state=open]:bg-muted"
        aria-label="Account menu"
      >
        <UserAvatar name={name} className="size-8" />
        <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-1.5">
        <DropdownMenuLabel className="flex items-center gap-3 p-2">
          <UserAvatar name={name} className="size-10" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{name}</p>
            <p className="truncate text-xs font-normal text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <div className="px-2 pb-2">
          <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide", TONES[ROLE_TONE[role] ?? "neutral"])}>
            {role.charAt(0) + role.slice(1).toLowerCase()}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={ROLE_DASHBOARD[role] || "/"}>
            <LayoutDashboard className="size-4" /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings className="size-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout} disabled={isPending} variant="destructive">
          <LogOut className="size-4" /> {isPending ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
