"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` as soon as it loads, so the map only renders in the browser.
export const MapView = dynamic(() => import("./map-view"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-muted" />,
});
