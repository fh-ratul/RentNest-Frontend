"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ICategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function PropertyFilters({ categories }: { categories: ICategory[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") ?? "");

  const hasActiveFilters = city || minPrice || maxPrice || categoryId || search;

  const navigate = (href: string) => startTransition(() => router.push(href));

  const applyFilters = (event?: React.FormEvent) => {
    event?.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (categoryId) params.set("categoryId", categoryId);
    navigate(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setCategoryId("");
    navigate("/properties");
  };

  const pickCategory = (id: string) => {
    setCategoryId(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set("categoryId", id);
    else params.delete("categoryId");
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={applyFilters}
        className="relative overflow-hidden rounded-xl border bg-background p-3 sm:p-4"
      >
        {/* Progress bar while the new results load */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 top-0 h-0.5 origin-left bg-linear-to-r from-primary to-brass transition-transform duration-700 ease-(--ease-out-expo)",
            isPending ? "scale-x-100 animate-pulse" : "scale-x-0"
          )}
        />
        <div className="grid gap-3 lg:grid-cols-[minmax(14rem,1.6fr)_minmax(8rem,1fr)_7rem_7rem_auto] lg:items-end">
          <Field label="Search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title or address…"
                className="h-10 pl-10"
              />
            </div>
          </Field>
          <div className="grid grid-cols-3 gap-3 lg:contents">
            <Field label="City">
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Any city" className="h-10" />
            </Field>
            <Field label="Min $">
              <Input type="number" min={0} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="No min" className="h-10" />
            </Field>
            <Field label="Max $">
              <Input type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="No max" className="h-10" />
            </Field>
          </div>

          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                onClick={clearFilters}
                aria-label="Clear filters"
                className="animate-in fade-in zoom-in-75 duration-300"
              >
                <X className="size-4" />
              </Button>
            )}
            <Button type="submit" size="lg" disabled={isPending} className="h-10 flex-1 px-5 lg:flex-none">
              <SlidersHorizontal className="size-4" /> {isPending ? "Searching…" : "Apply"}
            </Button>
          </div>
        </div>
      </form>

      {categories.length > 0 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          <CategoryChip active={!categoryId} onClick={() => pickCategory("")}>
            All homes
          </CategoryChip>
          {categories.map((c) => (
            <CategoryChip key={c.id} active={categoryId === c.id} onClick={() => pickCategory(c.id)}>
              {c.name}
            </CategoryChip>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="pl-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
