import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/shared/stat-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { getMyProperties } from "./_actions/propertyActions";
import { getLandlordRequests } from "./_actions/requestActions";
import { IProperty, ILandlordRentalRequest } from "@/lib/types";
import { ArrowRight, BellRing, Building2, Clock, Home, Plus, Wallet } from "lucide-react";
import { formatBDT } from "@/lib/utils";

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
      <PageHeader
        title="Landlord overview"
        description="A snapshot of your listings and requests."
        actions={
          <Button asChild className="px-4">
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="size-4" /> Add property
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard index={0} icon={Building2} label="Properties" value={properties.length} tone="brand" />
        <StatCard index={1} icon={Clock} label="Pending requests" value={pendingCount} tone="warning" />
        <StatCard index={2} icon={Home} label="Active leases" value={activeCount} tone="success" />
        <StatCard
          index={3}
          icon={Wallet}
          label="Total earnings"
          value={formatBDT(earnings, { decimals: true })}
          tone="info"
        />
      </div>

      {pendingCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-warning/30 bg-warning/10 p-5 animate-in fade-in slide-in-from-bottom-2 fill-mode-both delay-300 duration-700">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-warning/20 text-warning">
              <BellRing className="size-5" />
            </span>
            <p className="text-sm">
              You have <span className="font-semibold">{pendingCount} pending request{pendingCount > 1 ? "s" : ""}</span>{" "}
              awaiting your response.
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="group">
            <Link href="/dashboard/landlord/requests">
              Review now <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
