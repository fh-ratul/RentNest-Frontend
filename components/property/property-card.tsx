import Link from "next/link";
import { ViewTransition } from "react";
import { IProperty } from "@/lib/types";
import PropertyImage from "@/components/shared/property-image";
import { ArrowUpRight } from "lucide-react";

export default function PropertyCard({ property, priority }: { property: IProperty; priority?: boolean }) {
  const price = Number(property.price).toLocaleString("en-US");

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <article>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
          <ViewTransition name={`property-image-${property.id}`} share="morph" default="none">
            <div className="absolute inset-0">
              <PropertyImage
                src={property.images?.[0]}
                alt={property.title}
                priority={priority}
                className="transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover:scale-[1.04]"
              />
            </div>
          </ViewTransition>
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

          {property.category && (
            <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[oklch(0.25_0.04_258)] shadow-sm">
              {property.category.name}
            </span>
          )}
          <span className="absolute right-3 top-3 flex size-9 translate-y-1 items-center justify-center rounded-full bg-white/95 text-[oklch(0.25_0.04_258)] opacity-0 shadow-sm transition-all duration-500 ease-(--ease-out-expo) group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        <div className="pt-4">
          <p className="eyebrow text-[0.65rem]! text-muted-foreground!">{property.city}</p>
          <div className="mt-1.5 flex items-start justify-between gap-4">
            <h3 className="line-clamp-1 text-xl font-medium decoration-brass decoration-1 underline-offset-[6px] group-hover:underline">
              {property.title}
            </h3>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3 text-sm">
            <p className="text-muted-foreground">
              {property.bedrooms} {property.bedrooms === 1 ? "bed" : "beds"}
              <span className="mx-2 text-border">|</span>
              {property.bathrooms} {property.bathrooms === 1 ? "bath" : "baths"}
            </p>
            <p className="whitespace-nowrap">
              <span className="font-semibold tabular-nums">${price}</span>
              <span className="text-muted-foreground"> / month</span>
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
