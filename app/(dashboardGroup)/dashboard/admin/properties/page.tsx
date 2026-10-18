import { PageHeader, Panel } from "@/components/dashboard/page-header";
import AdminPropertiesTable from "@/components/dashboard/admin/properties-table";
import { getAllAdminProperties } from "../_actions/adminActions";
import { IAdminProperty } from "@/lib/types";

export default async function AdminPropertiesPage() {
  const result = await getAllAdminProperties();
  const properties: IAdminProperty[] = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="All properties" description="Every listing across the platform." />
      <Panel>
        <AdminPropertiesTable properties={properties} />
      </Panel>
    </div>
  );
}