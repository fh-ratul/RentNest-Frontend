import StatCard from "@/components/shared/stat-card";
import { getAllUsers, getAllAdminProperties, getAllAdminRentals } from "./_actions/adminActions";
import { IAdminUser, IAdminProperty, IAdminRentalRequest } from "@/lib/types";
import { Users, Building2, ClipboardList, Clock } from "lucide-react";

export default async function AdminOverviewPage() {
  const [usersResult, propertiesResult, rentalsResult] = await Promise.all([
    getAllUsers(),
    getAllAdminProperties(),
    getAllAdminRentals(),
  ]);

  const users: IAdminUser[] = usersResult.success ? usersResult.data : [];
  const properties: IAdminProperty[] = propertiesResult.success ? propertiesResult.data : [];
  const rentals: IAdminRentalRequest[] = rentalsResult.success ? rentalsResult.data : [];

  const pendingCount = rentals.filter((r) => r.status === "PENDING").length;
  const tenantCount = users.filter((u) => u.role === "TENANT").length;
  const landlordCount = users.filter((u) => u.role === "LANDLORD").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Admin Overview</h1>
        <p className="text-muted-foreground">Platform-wide snapshot.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={users.length} colorClass="text-primary bg-primary/10" />
        <StatCard icon={Building2} label="Properties" value={properties.length} colorClass="text-blue-600 bg-blue-50" />
        <StatCard icon={ClipboardList} label="Rental Requests" value={rentals.length} colorClass="text-teal-600 bg-teal-50" />
        <StatCard icon={Clock} label="Pending Requests" value={pendingCount} colorClass="text-amber-600 bg-amber-50" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">Tenants</p>
          <p className="text-2xl font-semibold">{tenantCount}</p>
        </div>
        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">Landlords</p>
          <p className="text-2xl font-semibold">{landlordCount}</p>
        </div>
      </div>
    </div>
  );
}