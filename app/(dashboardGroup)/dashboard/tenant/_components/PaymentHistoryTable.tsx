import { IPayment } from "@/lib/types";
import StatusBadge from "@/components/shared/status-badge";
import { Panel } from "@/components/dashboard/page-header";
import { PAYMENT_STATUS_TONE } from "@/lib/tones";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/shared/empty-state";
import { Receipt } from "lucide-react";
import { formatBDT } from "@/lib/utils";

export default function PaymentHistoryTable({ payments }: { payments: IPayment[] }) {
  if (!payments.length) {
    return (
      <EmptyState
        icon={Receipt}
        title="No payments yet"
        description="Your payment history will show up here once you pay for an approved rental."
      />
    );
  }

  return (
    <Panel>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Paid At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.rentalRequest?.property.title ?? "-"}</TableCell>
              <TableCell className="font-semibold tabular-nums">{formatBDT(p.amount, { decimals: true })}</TableCell>
              <TableCell>
                <StatusBadge status={p.status} tone={PAYMENT_STATUS_TONE[p.status]} />
              </TableCell>
              <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Panel>
  );
}