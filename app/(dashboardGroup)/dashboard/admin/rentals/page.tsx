import { PageHeader, Panel } from "@/components/dashboard/page-header";
import AdminRentalsTable from "@/components/dashboard/admin/rentals-table";
import { getAllAdminRentals } from "../_actions/adminActions";
import { IAdminRentalRequest } from "@/lib/types";

export default async function AdminRentalsPage() {
  const result = await getAllAdminRentals();
  const rentals: IAdminRentalRequest[] = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="All rental requests" description="Platform-wide rental activity." />
      <Panel>
        <AdminRentalsTable rentals={rentals} />
      </Panel>
    </div>
  );
}