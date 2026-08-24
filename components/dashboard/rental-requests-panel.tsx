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
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({tab === "ALL" ? rentals.length : rentals.filter((r) => r.status === tab).length})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nothing here" description="No requests match this filter." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((rental) => (
            <RentalRequestCard key={rental.id} rental={rental} />
          ))}
        </div>
      )}
    </div>
  );
}