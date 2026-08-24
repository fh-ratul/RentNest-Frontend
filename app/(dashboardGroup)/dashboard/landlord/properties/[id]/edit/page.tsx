import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import PropertyForm from "@/components/dashboard/landlord/property-form";
import { getCategories } from "@/app/properties/_actions/propertyActions";
import { getPropertyByIdForEdit } from "../../_actions/../../_actions/propertyActions";
import { ICategory, IProperty } from "@/lib/types";

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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Property</h1>
        <p className="text-muted-foreground">{property.title}</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <PropertyForm categories={categories} property={property} />
        </CardContent>
      </Card>
    </div>
  );
}