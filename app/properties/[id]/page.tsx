import { notFound } from "next/navigation";
import { getMe } from "@/service/getMe";
import PropertyImage from "@/components/shared/property-image";
import RequestRentalForm from "@/components/property/request-rental-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Bath, MapPin } from "lucide-react";
import { IPropertyDetail } from "@/lib/types";
import { getPropertyById } from "../_actions/propertyDetailActions";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [propertyResult, user] = await Promise.all([getPropertyById(id), getMe()]);

  if (!propertyResult.success) {
    notFound();
  }

  const property: IPropertyDetail = propertyResult.data;
  const isTenant = user.success && user.data.role === "TENANT";
  const isAvailable = property.status === "AVAILABLE";

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="relative h-72 overflow-hidden rounded-lg bg-muted md:col-span-2 md:h-96">
          <PropertyImage src={property.images?.[0]} alt={property.title} />
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {property.images?.slice(1, 3).map((img, i) => (
            <div key={i} className="relative h-32 overflow-hidden rounded-lg bg-muted md:h-[11.5rem]">
              <PropertyImage src={img} alt={`${property.title} ${i + 2}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">{property.title}</h1>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {property.address}, {property.city}
                </p>
              </div>
              <Badge variant={isAvailable ? "default" : "secondary"}>{property.status}</Badge>
            </div>

            <div className="mt-4 flex gap-6 rounded-lg border p-4 text-sm">
              <span className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-muted-foreground" /> {property.bedrooms} Beds
              </span>
              <span className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-muted-foreground" /> {property.bathrooms} Baths
              </span>
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-semibold">Description</h2>
            <p className="whitespace-pre-line text-muted-foreground">{property.description}</p>
          </div>

          {property.amenities?.length > 0 && (
            <div>
              <h2 className="mb-2 font-semibold">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <Badge key={a} variant="outline">{a}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-2 font-semibold">Listed by</h2>
            <p className="text-muted-foreground">{property.landlord.name}</p>
          </div>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="space-y-4 p-6">
              <p className="text-2xl font-bold">
                ${property.price}
                <span className="text-sm font-normal text-muted-foreground"></span>
              </p>

              {!isAvailable ? (
                <p className="text-sm text-muted-foreground">This property is not currently available.</p>
              ) : isTenant ? (
                <RequestRentalForm propertyId={property.id} />
              ) : user.success ? (
                <p className="text-sm text-muted-foreground">Only tenants can request to rent a property.</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  <a href="/login" className="underline">Log in</a> as a tenant to request this property.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
