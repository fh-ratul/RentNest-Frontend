"use client";

import dynamic from "next/dynamic";

// Browser-only: the widget reads the visitor's saved destination from
// localStorage on its first render, which the server can't do.
export const CommuteWidget = dynamic(() => import("./commute-widget"), {
  ssr: false,
  loading: () => <div className="h-32 animate-pulse rounded-2xl border bg-muted/50" />,
});
