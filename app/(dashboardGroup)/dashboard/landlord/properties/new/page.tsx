import { Card, CardContent } from "@/components/ui/card";
import PropertyForm from "@/components/dashboard/landlord/property-form";
import { getCategories } from "@/app/properties/_actions/propertyActions";
import { ICategory } from "@/lib/types";

export default async function NewPropertyPage() {
  const categoriesResult = await getCategories();
  const categories: ICategory[] = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">List a New Property</h1>
        <p className="text-muted-foreground">Fill in the details below to create a listing.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <PropertyForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}