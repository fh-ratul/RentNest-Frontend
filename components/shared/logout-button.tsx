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
      className="w-full justify-start text-muted-foreground hover:text-red-600"
      onClick={handleLogout}
      disabled={isPending}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}