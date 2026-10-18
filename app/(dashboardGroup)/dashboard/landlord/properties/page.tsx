import Link from "next/link";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import PropertyListCard from "@/components/dashboard/landlord/property-list-card";
import { getMyProperties } from "../_actions/propertyActions";
import { IProperty } from "@/lib/types";
import { Building2, Plus } from "lucide-react";

export default async function LandlordPropertiesPage() {
  const result = await getMyProperties();
  const properties: IProperty[] = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My properties"
        description={`${properties.length} listed`}
        actions={
          <Button asChild className="px-4">
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="size-4" /> Add property
            </Link>
          </Button>
        }
      />

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
          {properties.map((property, i) => (
            <div
              key={property.id}
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700"
            >
              <PropertyListCard property={property} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}