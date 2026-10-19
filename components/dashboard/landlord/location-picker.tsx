"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, LocateFixed, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/map";
import { searchPlaceAction } from "@/app/properties/_actions/neighbourhoodActions";

const DHAKA: [number, number] = [23.8103, 90.4125];

type Point = { lat: number; lng: number };

type Props = {
  initial?: Point | null;
  // Reads the address and city typed in the form at the moment of the search.
  getAddress: () => { address: string; city: string };
};

export default function LocationPicker({ initial, getAddress }: Props) {
  const [point, setPoint] = useState<Point | null>(initial ?? null);
  // Where the map is looking; only moves on a search, so dragging the pin doesn't jump the map.
  const [view, setView] = useState<{ center: [number, number]; zoom: number }>(
    initial ? { center: [initial.lat, initial.lng], zoom: 16 } : { center: DHAKA, zoom: 11 }
  );
  const [searching, startSearch] = useTransition();

  const findAddress = () => {
    const { address, city } = getAddress();
    if (!address || !city) {
      toast.error("Type the address and city first");
      return;
    }

    startSearch(async () => {
      const result = await searchPlaceAction(address, city);
      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      const { lat, lng, approximate } = result.data;
      setPoint({ lat, lng });
      setView({ center: [lat, lng], zoom: approximate ? 13 : 16 });
      if (approximate) {
        toast.message("Couldn't find the exact address, so the pin is in the city centre. Drag it to the right spot.");
      } else {
        toast.success("Address found. Drag the pin if it isn't exactly right.");
      }
    });
  };

  return (
    <div className="space-y-3">
      {/* Read by the property form's server action. Empty = no pin. */}
      <input type="hidden" name="latitude" value={point?.lat ?? ""} />
      <input type="hidden" name="longitude" value={point?.lng ?? ""} />

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={findAddress} disabled={searching}>
          {searching ? <Loader2 className="size-4 animate-spin" /> : <LocateFixed className="size-4" />}
          {searching ? "Finding..." : "Find address on map"}
        </Button>
        {point && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setPoint(null)} className="text-muted-foreground">
            <X className="size-4" /> Remove pin
          </Button>
        )}
      </div>

      <div className="h-72">
        <MapView
          center={view.center}
          zoom={view.zoom}
          marker={point ? [point.lat, point.lng] : null}
          onPick={(lat, lng) => setPoint({ lat, lng })}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {point
          ? `Pin set at ${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}. Drag it or click the map to adjust.`
          : "Click the map or use the button to drop a pin. Tenants then see what's nearby and how far their office is."}
      </p>
    </div>
  );
}
