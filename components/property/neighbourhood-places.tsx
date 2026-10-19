import { Banknote, Bus, GraduationCap, Hospital, Landmark, MapPin, Pill, ShoppingBasket, Trees } from "lucide-react";
import { INeighbourhood } from "@/lib/types";

const ICONS: Record<string, typeof MapPin> = {
  schools: GraduationCap,
  mosques: Landmark,
  healthcare: Hospital,
  pharmacies: Pill,
  shopping: ShoppingBasket,
  banks: Banknote,
  transport: Bus,
  parks: Trees,
};

const formatDistance = (m: number) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1).replace(/\.0$/, "")} km`);

// Only kinds of place that were found are shown: OpenStreetMap can be
// incomplete, so a missing one doesn't mean there are none.
export default function NeighbourhoodPlaces({ neighbourhood }: { neighbourhood: INeighbourhood }) {
  const found = neighbourhood.categories.filter((c) => c.count > 0);
  if (!found.length) return null;

  return (
    // grid-cols-1 lets long place names truncate instead of widening the page on phones
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {found.map((category) => {
        const Icon = ICONS[category.key] ?? MapPin;
        return (
          <li key={category.key} className="flex gap-3 rounded-xl border bg-card px-4 py-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {category.label}{" "}
                <span className="font-normal text-muted-foreground">
                  · {category.count}
                  {category.more ? "+" : ""} within {formatDistance(neighbourhood.radiusM)}
                </span>
              </p>
              {category.nearest && (
                <p className="truncate text-xs text-muted-foreground">
                  Nearest: {category.nearest.name} · {formatDistance(category.nearest.distanceM)}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
