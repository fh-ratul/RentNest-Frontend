import { notFound } from "next/navigation";
import { PageHeader, Panel } from "@/components/dashboard/page-header";
import PropertyForm from "@/components/dashboard/landlord/property-form";
import { getCategories } from "@/app/properties/_actions/propertyActions";
import { getPropertyByIdForEdit } from "../../_actions/../../_actions/propertyActions";
import { ICategory, IProperty } from "@/lib/types";

// "Draft with AI" runs as a server action from this page and can take ~20s.
export const maxDuration = 60;

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [propertyResult, categoriesResult] = await Promise.all([
    getPropertyByIdForEdit(id),
    getCategories(),
  ]);

  if (!propertyResult.success) notFound();

  const property: IProperty = propertyResult.data;
  const categories: ICategory[] = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Edit property" description={property.title} />
      <Panel className="p-5 sm:p-8">
          <PropertyForm categories={categories} property={property} />
      </Panel>
    </div>
  );
}