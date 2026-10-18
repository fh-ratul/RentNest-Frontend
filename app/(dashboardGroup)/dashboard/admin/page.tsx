import Link from "next/link";
import StatCard from "@/components/shared/stat-card";
import { PageHeader, Panel } from "@/components/dashboard/page-header";
import { getAllUsers, getAllAdminProperties, getAllAdminRentals } from "./_actions/adminActions";
import { IAdminUser, IAdminProperty, IAdminRentalRequest } from "@/lib/types";
import { ArrowRight, Building2, ClipboardList, Clock, Home, Users } from "lucide-react";

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
  const total = Math.max(tenantCount + landlordCount, 1);

  const split = [
    { label: "Tenants", count: tenantCount, icon: Home, bar: "bg-primary" },
    { label: "Landlords", count: landlordCount, icon: Building2, bar: "bg-info" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Admin overview" description="Platform-wide snapshot." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard index={0} icon={Users} label="Total users" value={users.length} tone="brand" />
        <StatCard index={1} icon={Building2} label="Properties" value={properties.length} tone="info" />
        <StatCard index={2} icon={ClipboardList} label="Rental requests" value={rentals.length} tone="violet" />
        <StatCard index={3} icon={Clock} label="Pending requests" value={pendingCount} tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel className="p-6">
          <h2 className="font-semibold">User mix</h2>
          <p className="text-sm text-muted-foreground">How the community splits between roles.</p>
          <div className="mt-6 space-y-5">
            {split.map((s) => (
              <div key={s.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <s.icon className="size-4 text-muted-foreground" /> {s.label}
                  </span>
                  <span className="font-heading text-lg font-medium tabular-nums">{s.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full origin-left rounded-full ${s.bar} animate-in slide-in-from-left-full duration-1000 ease-(--ease-out-expo)`}
                    style={{ width: `${(s.count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="flex flex-col justify-between gap-6 p-6">
          <div>
            <h2 className="font-semibold">Needs attention</h2>
            <p className="text-sm text-muted-foreground">
              {pendingCount > 0
                ? `${pendingCount} rental request${pendingCount > 1 ? "s are" : " is"} waiting on a landlord.`
                : "No rental requests are waiting right now."}
            </p>
          </div>
          <div className="grid gap-2">
            {[
              { href: "/dashboard/admin/users", label: "Manage users" },
              { href: "/dashboard/admin/properties", label: "Review listings" },
              { href: "/dashboard/admin/rentals", label: "Track rentals" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all hover:border-primary/40 hover:bg-accent/50"
              >
                {link.label}
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
