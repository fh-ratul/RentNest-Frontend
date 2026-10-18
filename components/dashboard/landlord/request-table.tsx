"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { ILandlordRentalRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/shared/status-badge";
import { updateRequestStatus } from "@/app/(dashboardGroup)/dashboard/landlord/_actions/requestActions";
import EmptyState from "@/components/shared/empty-state";
import { UserAvatar } from "@/components/shared/user-menu";
import { Check, X, CheckCheck, Inbox } from "lucide-react";

type Action = { id: string; status: "APPROVED" | "REJECTED" | "COMPLETED" };

export default function RequestTable({ requests }: { requests: ILandlordRentalRequest[] }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticRequests, applyOptimistic] = useOptimistic(
    requests,
    (state, { id, status }: Action) =>
      state.map((r) => (r.id === id ? { ...r, status } : r))
  );

  const handleAction = (id: string, status: Action["status"]) => {
    startTransition(async () => {
      applyOptimistic({ id, status });
      const result = await updateRequestStatus(id, status);
      if (!result.success) {
        toast.error(result.message || "Failed to update status");
      } else {
        toast.success(`Request ${status.toLowerCase()}`);
      }
    });
  };

  if (optimisticRequests.length === 0) {
    return (
      <div className="p-4">
        <EmptyState icon={Inbox} title="No rental requests yet" description="Requests from tenants will show up here." />
      </div>
    );
  }

  return (
    <Table className="min-w-[760px]">
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Tenant</TableHead>
          <TableHead>Move-in</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {optimisticRequests.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.property.title}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <UserAvatar name={r.tenant.name} className="size-8" />
                <div>
                  <p className="font-medium">{r.tenant.name}</p>
                  <p className="text-xs text-muted-foreground">{r.tenant.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{new Date(r.moveInDate).toLocaleDateString()}</TableCell>
            <TableCell><StatusBadge status={r.status} /></TableCell>
            <TableCell className="text-right">
              {r.status === "PENDING" && (
                <div className="flex justify-end gap-2">
                  <Button size="sm" disabled={isPending} onClick={() => handleAction(r.id, "APPROVED")}>
                    <Check className="size-3.5" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleAction(r.id, "REJECTED")}
                    className="text-destructive hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="size-3.5" /> Reject
                  </Button>
                </div>
              )}
              {r.status === "ACTIVE" && (
                <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleAction(r.id, "COMPLETED")}>
                  <CheckCheck className="size-3.5" /> Mark Completed
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
