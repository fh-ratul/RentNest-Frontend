import { IPayment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/shared/empty-state";
import { Receipt } from "lucide-react";

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800 hover:bg-green-100",
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  FAILED: "bg-red-100 text-red-800 hover:bg-red-100",
};

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
    <Card className="overflow-hidden py-0">
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
              <TableCell>${p.amount}</TableCell>
              <TableCell>
                <Badge className={PAYMENT_STATUS_STYLES[p.status]}>{p.status}</Badge>
              </TableCell>
              <TableCell>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}