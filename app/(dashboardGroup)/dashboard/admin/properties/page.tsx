import { Card } from "@/components/ui/card";
import AdminPropertiesTable from "@/components/dashboard/admin/properties-table";
import { getAllAdminProperties } from "../_actions/adminActions";
import { IAdminProperty } from "@/lib/types";

export default async function AdminPropertiesPage() {
  const result = await getAllAdminProperties();
  const properties: IAdminProperty[] = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">All Properties</h1>
        <p className="text-muted-foreground">Every listing across the platform.</p>
      </div>
      <Card className="overflow-hidden py-0">
        <AdminPropertiesTable properties={properties} />
      </Card>
    </div>
  );
}