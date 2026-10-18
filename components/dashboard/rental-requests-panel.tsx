"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IRentalRequest } from "@/lib/types";
import RentalRequestCard from "./rental-request-card";
import EmptyState from "@/components/shared/empty-state";
import { ClipboardList } from "lucide-react";

const TABS = ["ALL", "PENDING", "APPROVED", "ACTIVE", "COMPLETED", "REJECTED"] as const;

export default function RentalRequestsPanel({ rentals }: { rentals: IRentalRequest[] }) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("ALL");

  const filtered = activeTab === "ALL" ? rentals : rentals.filter((r) => r.status === activeTab);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="h-auto! max-w-full flex-wrap justify-start gap-1 rounded-2xl bg-muted/70 p-1">
          {TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="h-8 flex-none rounded-xl px-3">
              {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              <span className="rounded-full bg-foreground/5 px-1.5 text-[11px] tabular-nums text-muted-foreground">
                {tab === "ALL" ? rentals.length : rentals.filter((r) => r.status === tab).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nothing here" description="No requests match this filter." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((rental, i) => (
            <div
              key={`${activeTab}-${rental.id}`}
              style={{ animationDelay: `${Math.min(i, 6) * 50}ms` }}
              className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500"
            >
              <RentalRequestCard rental={rental} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}