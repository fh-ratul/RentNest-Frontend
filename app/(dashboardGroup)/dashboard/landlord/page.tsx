import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/shared/stat-card";
import { getMyProperties } from "./_actions/propertyActions";
import { getLandlordRequests } from "./_actions/requestActions";
import { IProperty, ILandlordRentalRequest } from "@/lib/types";
import { Building2, Clock, Home, Wallet, Plus } from "lucide-react";

export default async function LandlordOverviewPage() {
  const [propertiesResult, requestsResult] = await Promise.all([
    getMyProperties(),
    getLandlordRequests(),
  ]);

  const properties: IProperty[] = propertiesResult.success ? propertiesResult.data : [];
  const requests: ILandlordRentalRequest[] = requestsResult.success ? requestsResult.data : [];

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const activeCount = requests.filter((r) => r.status === "ACTIVE").length;
  const earnings = requests
    .filter((r) => r.payment?.status === "COMPLETED")
    .reduce((sum, r) => sum + Number(r.payment!.amount), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Landlord Overview</h1>
          <p className="text-muted-foreground">A snapshot of your listings and requests.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/landlord/properties/new">
            <Plus className="mr-2 h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Building2} label="Properties" value={properties.length} colorClass="text-primary bg-primary/10" />
        <StatCard icon={Clock} label="Pending Requests" value={pendingCount} colorClass="text-amber-600 bg-amber-50" />
        <StatCard icon={Home} label="Active Leases" value={activeCount} colorClass="text-green-600 bg-green-50" />
        <StatCard icon={Wallet} label="Total Earnings" value={`$${earnings.toFixed(2)}`} colorClass="text-blue-600 bg-blue-50" />
      </div>

      {pendingCount > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          You have {pendingCount} pending request{pendingCount > 1 ? "s" : ""} awaiting your response.{" "}
          <Link href="/dashboard/landlord/requests" className="font-medium underline">
            Review now
          </Link>
        </div>
      )}
    </div>
  );
}