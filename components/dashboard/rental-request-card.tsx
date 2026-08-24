import Link from "next/link";
import { IRentalRequest } from "@/lib/types";
import PropertyImage from "@/components/shared/property-image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/status-badge";
import { MapPin, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_ACCENT: Record<string, string> = {
  PENDING: "border-t-amber-400",
  APPROVED: "border-t-blue-400",
  REJECTED: "border-t-red-400",
  ACTIVE: "border-t-green-400",
  COMPLETED: "border-t-gray-400",
};

export default function RentalRequestCard({ rental }: { rental: IRentalRequest }) {
  const { property, status, payment, review } = rental;

  return (
    <Card className={cn("overflow-hidden border-t-4 py-0 transition-shadow hover:shadow-md", STATUS_ACCENT[status])}>
      <div className="relative h-40 w-full bg-muted">
        <PropertyImage src={property.images?.[0]} alt={property.title} />
      </div>
      <CardContent className="space-y-3 p-4">
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

        <div className="flex items-center gap-2 pt-1">
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
            <p className="text-xs text-muted-foreground">Waiting for landlord approval...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}