import PropertyCard from "@/components/property/property-card";
import PropertyFilters from "@/components/property/property-filters";
import EmptyState from "@/components/shared/empty-state";
import { getCategories, getProperties } from "./_actions/propertyActions";
import { IProperty, ICategory } from "@/lib/types";
import { SearchX } from "lucide-react";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  const [propertiesResult, categoriesResult] = await Promise.all([
    getProperties(params),
    getCategories(),
  ]);

  const properties: IProperty[] = propertiesResult.success ? propertiesResult.data : [];
  const categories: ICategory[] = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Browse Properties</h1>
        <p className="text-muted-foreground">
          {properties.length} {properties.length === 1 ? "property" : "properties"} available
        </p>
      </div>

      <PropertyFilters categories={categories} />

      {properties.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No properties found"
          description="Try adjusting your filters or search terms."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}