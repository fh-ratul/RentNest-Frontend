"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/service/logout";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LogoutButton() {
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
    <Button
      variant="ghost"
      className="h-10 w-full justify-start gap-3 rounded-xl px-3 font-medium text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive"
      onClick={handleLogout}
      disabled={isPending}
    >
      <LogOut className="size-4" />
      {isPending ? "Logging out..." : "Log out"}
    </Button>
  );
}