"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-2 rounded-2xl border bg-background/95 p-2 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:rounded-full">
      <Search className="hidden h-5 w-5 shrink-0 text-muted-foreground sm:ml-3 sm:block" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search by city or property name..."
        className="border-0 shadow-none focus-visible:ring-0"
      />
      <Button onClick={handleSearch} size="lg" className="w-full rounded-full px-6 sm:w-auto">
        Search
      </Button>
    </div>
  );
}
