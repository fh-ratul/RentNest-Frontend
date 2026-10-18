"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Radix Select can't use "" as a value, so "any" stands for no limit.
const BUDGETS = [
  { value: "any", label: "Any budget" },
  { value: "1000", label: "Up to $1,000" },
  { value: "2500", label: "Up to $2,500" },
  { value: "5000", label: "Up to $5,000" },
  { value: "10000", label: "Up to $10,000" },
  { value: "50000", label: "Up to $50,000" },
];

const QUICK_CITIES = ["Dhaka", "Chattogram", "Sylhet"];

export default function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("any");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("search", location.trim());
    if (maxPrice !== "any") params.set("maxPrice", maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-3xl">
      <form
        onSubmit={handleSearch}
        role="search"
        className="grid gap-px overflow-hidden rounded-xl border border-white/15 bg-border shadow-[0_30px_60px_-25px_rgba(0,0,0,0.55)] sm:grid-cols-[1.4fr_1fr_auto]"
      >
        <label className="group flex flex-col gap-1 bg-card px-5 py-3.5 text-left transition-colors focus-within:bg-accent/40">
          <span className="eyebrow text-[0.65rem]! tracking-[0.18em]!">Location</span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, area or property name"
              className="w-full min-w-0 bg-transparent text-[0.95rem] text-foreground outline-none placeholder:text-muted-foreground/80"
            />
          </span>
        </label>

        <div className="flex flex-col gap-1 bg-card px-5 py-3.5 text-left transition-colors focus-within:bg-accent/40">
          <span id="hero-budget-label" className="eyebrow text-[0.65rem]! tracking-[0.18em]!">
            Monthly budget
          </span>
          <span className="flex items-center gap-2">
            <Wallet className="size-4 shrink-0 text-muted-foreground" />
            <Select value={maxPrice} onValueChange={setMaxPrice}>
              <SelectTrigger
                aria-labelledby="hero-budget-label"
                className="w-full min-w-0 cursor-pointer border-0 bg-transparent p-0 text-[0.95rem] text-foreground shadow-none focus-visible:ring-0 data-[size=default]:h-auto dark:bg-transparent"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start" sideOffset={16} className="min-w-56 p-1">
                {BUDGETS.map((b) => (
                  <SelectItem key={b.value} value={b.value} className="py-2.5">
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </span>
        </div>

        <div className="bg-card p-2">
          <Button type="submit" size="lg" className="h-full min-h-12 w-full px-7 text-[0.95rem]">
            <Search className="size-4" /> Search homes
          </Button>
        </div>
      </form>

      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
        Popular:
        {QUICK_CITIES.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => router.push(`/properties?city=${encodeURIComponent(city)}`)}
            className="font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-brass"
          >
            {city}
          </button>
        ))}
      </p>
    </div>
  );
}
