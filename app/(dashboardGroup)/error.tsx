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
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <AlertTriangle className="h-10 w-10 text-red-500" />
      <h2 className="mt-4 text-xl font-semibold">This section failed to load</h2>
      <p className="mt-1 text-muted-foreground">Try reloading this part of the dashboard.</p>
      <Button className="mt-6" onClick={() => reset()}>
        <RotateCw className="mr-2 h-4 w-4" /> Try Again
      </Button>
    </div>
  );
}