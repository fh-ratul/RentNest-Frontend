import { getMe } from "@/service/getMe";
import { getMyPayments } from "./_actions/paymentActions";
import { getMyRentals } from "./_actions/rentalActions";
import RentalRequestsPanel from "@/components/dashboard/rental-requests-panel";
import PaymentHistoryTable from "./_components/PaymentHistoryTable";
import StatCard from "@/components/shared/stat-card";
import EmptyState from "@/components/shared/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { IPayment, IRentalRequest } from "@/lib/types";
import { Clock, CheckCircle2, Home, Wallet, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TenantDashboardPage() {
  const [meResult, rentalsResult, paymentsResult] = await Promise.all([
    getMe(),
    getMyRentals(),
    getMyPayments(),
  ]);

  const firstName = meResult.success ? meResult.data.name.split(" ")[0] : "there";
  const rentals: IRentalRequest[] = rentalsResult.success ? rentalsResult.data : [];
  const payments: IPayment[] = paymentsResult.success ? paymentsResult.data : [];

  const pending = rentals.filter((r) => r.status === "PENDING").length;
  const active = rentals.filter((r) => r.status === "ACTIVE").length;
  const completed = rentals.filter((r) => r.status === "COMPLETED").length;
  const totalPaid = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title={<>Welcome back, {firstName} <span className="inline-block origin-[70%_70%] animate-[wave_2.4s_ease-in-out_1]">👋</span></>}
        description="Here's what's happening with your rentals."
        actions={
          <Button asChild variant="outline" className="group">
            <Link href="/properties">
              <Compass className="size-4" /> Find a home
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard index={0} icon={Clock} label="Pending" value={pending} tone="warning" />
        <StatCard index={1} icon={Home} label="Active rentals" value={active} tone="success" />
        <StatCard index={2} icon={CheckCircle2} label="Completed" value={completed} tone="neutral" />
        <StatCard
          index={3}
          icon={Wallet}
          label="Total paid"
          value={`$${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          tone="info"
        />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">My rental requests</h2>
        {rentals.length === 0 ? (
          <EmptyState
            icon={Home}
            title="No rental requests yet"
            description="Browse available properties and submit your first request."
            ctaLabel="Browse Properties"
            ctaHref="/properties"
          />
        ) : (
          <RentalRequestsPanel rentals={rentals} />
        )}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Payment history</h2>
        <PaymentHistoryTable payments={payments} />
      </div>
    </div>
  );
}