import { getMe } from "@/service/getMe";
import { getMyPayments } from "./_actions/paymentActions";
import { getMyRentals } from "./_actions/rentalActions";
import RentalRequestsPanel from "@/components/dashboard/rental-requests-panel";
import PaymentHistoryTable from "./_components/PaymentHistoryTable";
import StatCard from "@/components/shared/stat-card";
import EmptyState from "@/components/shared/empty-state";
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {firstName} 👋</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your rentals.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Clock} label="Pending" value={pending} colorClass="text-amber-600 bg-amber-50" />
        <StatCard icon={Home} label="Active Rentals" value={active} colorClass="text-green-600 bg-green-50" />
        <StatCard icon={CheckCircle2} label="Completed" value={completed} colorClass="text-gray-600 bg-gray-100" />
        <StatCard icon={Wallet} label="Total Paid" value={`$${totalPaid.toFixed(2)}`} colorClass="text-blue-600 bg-blue-50" />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">My Rental Requests</h2>
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
        <h2 className="mb-4 text-xl font-semibold">Payment History</h2>
        <PaymentHistoryTable payments={payments} />
      </div>
    </div>
  );
}