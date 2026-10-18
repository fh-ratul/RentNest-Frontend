"use client";

import { Check, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme, useTheme } from "./theme-provider";

const OPTIONS: { value: Theme; label: string; icon: typeof Sun; preview: string }[] = [
  { value: "light", label: "Light", icon: Sun, preview: "bg-[#faf8f4]" },
  { value: "dark", label: "Dark", icon: Moon, preview: "bg-[#0e141f]" },
];

// Large swatches for the settings page; the navbar has the compact toggle.
export function ThemePicker() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="grid max-w-md grid-cols-2 gap-3" role="radiogroup" aria-label="Theme">
      {OPTIONS.map(({ value, label, icon: Icon, preview }) => {
        const active = resolvedTheme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setTheme(value, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            }}
            className={cn(
              "group overflow-hidden rounded-2xl border text-left outline-none transition-all duration-300 focus-visible:ring-3 focus-visible:ring-ring/40",
              active ? "border-primary ring-3 ring-primary/15" : "hover:border-primary/40"
            )}
          >
            <div className={cn("relative h-16 sm:h-20", preview)}>
              <div className="absolute left-3 top-3 h-2 w-1/2 rounded-full bg-[#c2a06a]" />
              <div className="absolute left-3 top-7 h-1.5 w-2/3 rounded-full bg-neutral-400/40" />
              <div className="absolute left-3 top-10 h-1.5 w-1/3 rounded-full bg-neutral-400/40" />
              {active && (
                <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground animate-in zoom-in-50 duration-300">
                  <Check className="size-3" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 border-t bg-card px-3 py-2 text-sm font-medium">
              <Icon className="size-4 text-muted-foreground" /> {label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
