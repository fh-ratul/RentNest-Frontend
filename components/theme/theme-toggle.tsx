"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      // The new theme grows out of the button.
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTheme(next, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      className={cn("relative text-muted-foreground hover:text-foreground", className)}
    >
      <Sun className="size-[1.1rem] rotate-0 scale-100 transition-all duration-500 ease-out dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-[1.1rem] rotate-90 scale-0 transition-all duration-500 ease-out dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
