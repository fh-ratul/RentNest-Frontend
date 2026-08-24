import { Card } from "@/components/ui/card";
import AdminRentalsTable from "@/components/dashboard/admin/rentals-table";
import { getAllAdminRentals } from "../_actions/adminActions";
import { IAdminRentalRequest } from "@/lib/types";

export default async function AdminRentalsPage() {
  const result = await getAllAdminRentals();
  const rentals: IAdminRentalRequest[] = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">All Rental Requests</h1>
        <p className="text-muted-foreground">Platform-wide rental activity.</p>
      </div>
      <Card className="overflow-hidden py-0">
        <AdminRentalsTable rentals={rentals} />
      </Card>
    </div>
  );
}