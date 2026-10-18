"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 px-6 py-24 text-center animate-page-in">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </span>
      <h2 className="mt-5 text-xl font-semibold">This section failed to load</h2>
      <p className="mt-1 text-sm text-muted-foreground">Try reloading this part of the dashboard.</p>
      <Button className="mt-6 px-5" onClick={() => reset()}>
        <RotateCw className="size-4" /> Try again
      </Button>
    </div>
  );
}
