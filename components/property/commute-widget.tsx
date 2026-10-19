"use client";

import { useEffect, useState, useTransition } from "react";
import { Car, Footprints, Loader2, Navigation, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCommuteAction, searchPlaceAction, TPlace, TRoute } from "@/app/properties/_actions/neighbourhoodActions";

// The visitor's destination is remembered in this browser only, so it carries
// across listings without an account.
const STORAGE_KEY = "rentnest:commute-to";

const loadPlace = (): TPlace | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TPlace) : null;
  } catch {
    return null;
  }
};

const savePlace = (place: TPlace | null) => {
  try {
    if (place) localStorage.setItem(STORAGE_KEY, JSON.stringify(place));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage blocked: it just won't be remembered
  }
};

const formatMinutes = (minutes: number) =>
  minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60} min` : ""}`;

// Rendered in the browser only (see ./commute.tsx), so localStorage is available here.
export default function CommuteWidget({ propertyId }: { propertyId: string }) {
  const [place, setPlace] = useState<TPlace | null>(loadPlace);
  const [query, setQuery] = useState("");
  const [times, setTimes] = useState<{ car: TRoute; foot: TRoute } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const loadTimes = (to: TPlace) =>
    startTransition(async () => {
      setError(null);
      const result = await getCommuteAction(propertyId, to.lat, to.lng);
      if (result.success && result.data) setTimes(result.data);
      else {
        setTimes(null);
        setError(result.message);
      }
    });

  // A destination picked on another listing is reused here.
  useEffect(() => {
    if (place) loadTimes(place);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on mount
  }, []);

  const search = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim().length < 3) return;

    startTransition(async () => {
      setError(null);
      const result = await searchPlaceAction(query.trim());
      if (!result.success || !result.data) {
        setError(result.message);
        return;
      }
      setPlace(result.data);
      savePlace(result.data);
      setQuery("");
      const commute = await getCommuteAction(propertyId, result.data.lat, result.data.lng);
      if (commute.success && commute.data) setTimes(commute.data);
      else {
        setTimes(null);
        setError(commute.message);
      }
    });
  };

  const change = () => {
    setPlace(null);
    setTimes(null);
    setError(null);
    savePlace(null);
  };

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-semibold">
            <Navigation className="size-4 text-brass-ink" /> Your commute
          </p>
          <p className="text-sm text-muted-foreground">
            {place ? (
              <>
                To <span className="font-medium text-foreground">{place.label}</span>
              </>
            ) : (
              "How far is your office, university or anywhere you go often?"
            )}
          </p>
        </div>
        {place && (
          <Button type="button" variant="ghost" size="sm" onClick={change} className="shrink-0 text-muted-foreground">
            Change
          </Button>
        )}
      </div>

      {!place && (
        <form onSubmit={search} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Motijheel, Dhaka or BUET"
            className="h-10"
          />
          <Button type="submit" disabled={pending || query.trim().length < 3} className="h-10 shrink-0">
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Check
          </Button>
        </form>
      )}

      {place && pending && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Working out travel times...
        </p>
      )}

      {place && times && !pending && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {times.car && (
            <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3">
              <Car className="size-5 text-brass-ink" strokeWidth={1.5} />
              <div>
                <p className="font-semibold">{formatMinutes(times.car.minutes)} by car</p>
                <p className="text-xs text-muted-foreground">{times.car.km} km, without traffic</p>
              </div>
            </div>
          )}
          {times.foot && (
            <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3">
              <Footprints className="size-5 text-brass-ink" strokeWidth={1.5} />
              <div>
                <p className="font-semibold">{formatMinutes(times.foot.minutes)} on foot</p>
                <p className="text-xs text-muted-foreground">{times.foot.km} km</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && !pending && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
