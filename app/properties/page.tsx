import PropertyCard from "@/components/property/property-card";
import PropertyFilters from "@/components/property/property-filters";
import EmptyState from "@/components/shared/empty-state";
import ListingPagination from "@/components/property/listing-pagination";
import { getCategories, getProperties } from "./_actions/propertyActions";
import { IProperty, ICategory } from "@/lib/types";
import { SearchX } from "lucide-react";

export const metadata = { title: "Browse properties" };

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
  // The API returns one page; its meta has the count across all pages.
  const total: number = propertiesResult.success ? propertiesResult.meta?.total ?? properties.length : 0;
  const page = Math.max(1, Number(params.page) || 1);
  const totalPages = Math.ceil(total / (propertiesResult.meta?.limit || total || 1));
  const location = params.city || params.search;

  return (
    <div className="animate-page-in">
      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl space-y-8 px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Browse homes</p>
              <h1 className="mt-3 text-4xl font-normal sm:text-5xl">
                {location ? (
                  <>
                    Homes matching <em className="font-light text-brass-ink">“{location}”</em>
                  </>
                ) : (
                  <>
                    Find a place <em className="font-light text-brass-ink">you’ll love</em>
                  </>
                )}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{total}</span>{" "}
              {total === 1 ? "home" : "homes"} available
            </p>
          </div>

          <PropertyFilters categories={categories} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {properties.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No properties found"
            description="Try adjusting your filters or search terms."
            ctaLabel="Clear filters"
            ctaHref="/properties"
          />
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, i) => (
              <div
                key={property.id}
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700"
              >
                <PropertyCard property={property} priority={i < 3} />
              </div>
            ))}
          </div>
        )}
        <ListingPagination page={page} totalPages={totalPages} searchParams={params} />
      </section>
    </div>
  );
}
