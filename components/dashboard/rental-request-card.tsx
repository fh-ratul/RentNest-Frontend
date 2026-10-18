import Link from "next/link";
import { IRentalRequest } from "@/lib/types";
import PropertyImage from "@/components/shared/property-image";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/status-badge";
import { MapPin, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { RENTAL_STATUS_TONE, TONE_DOT } from "@/lib/tones";

export default function RentalRequestCard({ rental }: { rental: IRentalRequest }) {
  const { property, status, payment, review } = rental;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-500 ease-(--ease-out-expo) hover:-translate-y-0.5 hover:shadow-lift sm:flex-row">
      <span aria-hidden className={cn("absolute inset-x-0 top-0 z-10 h-1 sm:inset-y-0 sm:left-0 sm:right-auto sm:h-auto sm:w-1", TONE_DOT[RENTAL_STATUS_TONE[status] ?? "neutral"])} />
      <div className="relative h-40 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-40">
        <PropertyImage
          src={property.images?.[0]}
          alt={property.title}
          sizes="160px"
          className="transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{property.title}</h3>
          <StatusBadge status={status} />
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {property.address}, {property.city}
          </p>
          <p className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            Move-in: {new Date(rental.moveInDate).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-1">
          {status === "APPROVED" && !payment && (
            <Button asChild size="sm" className="flex-1">
              <Link href={`/dashboard/tenant/requests/${rental.id}/pay`}>Pay Now</Link>
            </Button>
          )}
          {status === "COMPLETED" && !review && (
            <Button asChild size="sm" variant="outline" className="flex-1">
              <Link href={`/dashboard/tenant/requests/${rental.id}/review`}>Leave Review</Link>
            </Button>
          )}
          {status === "PENDING" && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground"><span className="size-1.5 animate-pulse rounded-full bg-warning" /> Waiting for landlord approval…</p>
          )}
        </div>
      </div>
    </article>
  );
}