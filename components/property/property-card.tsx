import Link from "next/link";
import { IProperty } from "@/lib/types";
import PropertyImage from "@/components/shared/property-image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, MapPin } from "lucide-react";

export default function PropertyCard({ property }: { property: IProperty }) {
  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <Card className="overflow-hidden py-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-48 w-full bg-muted">
          <PropertyImage src={property.images?.[0]} alt={property.title} />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <Badge className="bg-black/80 text-white hover:bg-black/80">
              ${property.price}
              <span className="font-normal opacity-80">/mo</span>
            </Badge>
            {property.category && (
              <Badge variant="secondary" className="bg-white/90 text-foreground">
                {property.category.name}
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="space-y-3 p-4">
          <div>
            <h3 className="line-clamp-1 font-semibold transition-colors group-hover:text-primary">
              {property.title}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {property.city}
            </p>
          </div>

          <div className="flex items-center gap-4 border-t pt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Bed className="h-4 w-4" /> {property.bedrooms}
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" /> {property.bathrooms}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
