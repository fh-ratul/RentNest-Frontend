"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { cn } from "@/lib/utils";

export type MapViewProps = {
  center: [number, number];
  zoom?: number;
  marker?: [number, number] | null;
  // Lets the user move the pin by dragging it or clicking the map.
  onPick?: (lat: number, lng: number) => void;
  // A display-only map: no scroll-wheel zoom, so the page still scrolls.
  readOnly?: boolean;
  className?: string;
};

// A plain CSS pin: Leaflet's default marker images don't survive bundling.
const pinIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;margin:-28px 0 0 -14px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#b5893b;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
  iconSize: [0, 0],
});

// MapContainer only reads `center` once, so later changes are applied here.
// Depends on the numbers, not the array, so a re-render doesn't undo the user's panning.
function FollowCenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const [lat, lng] = center;
  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [map, lat, lng, zoom]);
  return null;
}

function ClickToPick({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function MapView({ center, zoom = 15, marker, onPick, readOnly, className }: MapViewProps) {
  return (
    // `isolate` keeps Leaflet's high z-indexes from covering the sticky navbar.
    <div className={cn("isolate h-full w-full overflow-hidden rounded-2xl border", className)}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={!readOnly} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FollowCenter center={center} zoom={zoom} />
        {onPick && <ClickToPick onPick={onPick} />}
        {marker && (
          <Marker
            position={marker}
            icon={pinIcon}
            draggable={Boolean(onPick)}
            eventHandlers={
              onPick
                ? {
                    dragend: (e) => {
                      const { lat, lng } = (e.target as L.Marker).getLatLng();
                      onPick(lat, lng);
                    },
                  }
                : undefined
            }
          />
        )}
      </MapContainer>
    </div>
  );
}
