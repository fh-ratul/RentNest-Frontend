"use client";

import { IAdminRentalRequest } from "@/lib/types";
import StatusBadge from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/shared/table-pagination";
import { useClientTable } from "@/hooks/use-client-table";
import { Search } from "lucide-react";

const PAYMENT_STYLES: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800 hover:bg-green-100",
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  FAILED: "bg-red-100 text-red-800 hover:bg-red-100",
};

export default function AdminRentalsTable({ rentals }: { rentals: IAdminRentalRequest[] }) {
  const { search, setSearch, page, setPage, totalPages, paged } = useClientTable(
    rentals,
    (r, q) => r.property.title.toLowerCase().includes(q) || r.tenant.name.toLowerCase().includes(q)
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 border-b p-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tenant or property..." className="pl-9" />
        </div>
        <p className="text-sm text-muted-foreground">{rentals.length} total requests</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Move-in</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.property.title}</TableCell>
              <TableCell>
                <p>{r.tenant.name}</p>
                <p className="text-xs text-muted-foreground">{r.tenant.email}</p>
              </TableCell>
              <TableCell>{new Date(r.moveInDate).toLocaleDateString()}</TableCell>
              <TableCell><StatusBadge status={r.status} /></TableCell>
              <TableCell>
                {r.payment ? <Badge className={PAYMENT_STYLES[r.payment.status]}>{r.payment.status}</Badge> : <span className="text-xs text-muted-foreground">—</span>}
              </TableCell>
            </TableRow>
          ))}
          {paged.length === 0 && (
            <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No rental requests found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}