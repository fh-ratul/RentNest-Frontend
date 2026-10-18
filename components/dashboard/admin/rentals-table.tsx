"use client";

import { IAdminRentalRequest } from "@/lib/types";
import StatusBadge from "@/components/shared/status-badge";
import { PAYMENT_STATUS_TONE } from "@/lib/tones";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/shared/table-pagination";
import { useClientTable } from "@/hooks/use-client-table";
import { Search } from "lucide-react";

export default function AdminRentalsTable({ rentals }: { rentals: IAdminRentalRequest[] }) {
  const { search, setSearch, page, setPage, totalPages, paged } = useClientTable(
    rentals,
    (r, q) => r.property.title.toLowerCase().includes(q) || r.tenant.name.toLowerCase().includes(q)
  );

  return (
    <div>
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tenant or property..." className="h-10 pl-10" />
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
                {r.payment ? <StatusBadge status={r.payment.status} tone={PAYMENT_STATUS_TONE[r.payment.status]} /> : <span className="text-xs text-muted-foreground">—</span>}
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