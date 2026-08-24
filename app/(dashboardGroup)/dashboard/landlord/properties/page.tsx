import Link from "next/link";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import PropertyListCard from "@/components/dashboard/landlord/property-list-card";
import { getMyProperties } from "../_actions/propertyActions";
import { IProperty } from "@/lib/types";
import { Building2, Plus } from "lucide-react";

export default async function LandlordPropertiesPage() {
  const result = await getMyProperties();
  const properties: IProperty[] = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Properties</h1>
          <p className="text-muted-foreground">{properties.length} listed</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/landlord/properties/new">
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties yet"
          description="Create your first listing to start receiving rental requests."
          ctaLabel="Add Property"
          ctaHref="/dashboard/landlord/properties/new"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyListCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}