import { PageHeader, Panel } from "@/components/dashboard/page-header";
import PropertyForm from "@/components/dashboard/landlord/property-form";
import { getCategories } from "@/app/properties/_actions/propertyActions";
import { ICategory } from "@/lib/types";

export default async function NewPropertyPage() {
  const categoriesResult = await getCategories();
  const categories: ICategory[] = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="List a new property" description={"Fill in the details below to create a listing."} />
      <Panel className="p-5 sm:p-8">
          <PropertyForm categories={categories} />
      </Panel>
    </div>
  );
}