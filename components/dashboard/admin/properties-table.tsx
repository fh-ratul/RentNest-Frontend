"use client";

import { IAdminProperty } from "@/lib/types";
import PropertyImage from "@/components/shared/property-image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/shared/table-pagination";
import { useClientTable } from "@/hooks/use-client-table";
import { Search } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-800 hover:bg-green-100",
  RENTED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  INACTIVE: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

export default function AdminPropertiesTable({ properties }: { properties: IAdminProperty[] }) {
  const { search, setSearch, page, setPage, totalPages, paged } = useClientTable(
    properties,
    (p, q) => p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.landlord.name.toLowerCase().includes(q)
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 border-b p-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, city, landlord..." className="pl-9" />
        </div>
        <p className="text-sm text-muted-foreground">{properties.length} total properties</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Landlord</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-muted">
                    <PropertyImage src={p.images?.[0]} alt={p.title} />
                  </div>
                  <span className="line-clamp-1 font-medium">{p.title}</span>
                </div>
              </TableCell>
              <TableCell>
                <p>{p.landlord.name}</p>
                <p className="text-xs text-muted-foreground">{p.landlord.email}</p>
              </TableCell>
              <TableCell>{p.city}</TableCell>
              <TableCell>${p.price}</TableCell>
              <TableCell><Badge className={STATUS_STYLES[p.status]}>{p.status}</Badge></TableCell>
            </TableRow>
          ))}
          {paged.length === 0 && (
            <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No properties found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}