"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ICategory } from "@/lib/types";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PropertyFilters({ categories }: { categories: ICategory[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") ?? "");

  const hasActiveFilters = city || minPrice || maxPrice || categoryId || search;

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (categoryId) params.set("categoryId", categoryId);
    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setCategoryId("");
    router.push("/properties");
  };

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          placeholder="Search by title or address..."
          className="pl-9"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(8rem,1fr)_7rem_7rem_minmax(9rem,1fr)_auto] lg:items-end">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">City</label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dhaka" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Min $</label>
          <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Max $</label>
          <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-9 w-full rounded-md border bg-background px-2 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button onClick={applyFilters} className="flex-1 lg:flex-none">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
