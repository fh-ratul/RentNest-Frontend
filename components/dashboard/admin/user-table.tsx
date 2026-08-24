"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { IAdminUser } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/shared/table-pagination";
import { useClientTable } from "@/hooks/use-client-table";
import { updateUserStatusAction } from "@/app/(dashboardGroup)/dashboard/admin/_actions/adminActions";
import { Search, ShieldBan, ShieldCheck } from "lucide-react";

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  LANDLORD: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  TENANT: "bg-teal-100 text-teal-800 hover:bg-teal-100",
};

export default function UserTable({ users }: { users: IAdminUser[] }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticUsers, applyOptimistic] = useOptimistic(
    users,
    (state, { id, activeStatus }: { id: string; activeStatus: "ACTIVE" | "BLOCKED" }) =>
      state.map((u) => (u.id === id ? { ...u, activeStatus } : u))
  );

  const { search, setSearch, page, setPage, totalPages, paged } = useClientTable(
    optimisticUsers,
    (u, q) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );

  const handleToggle = (user: IAdminUser) => {
    const nextStatus = user.activeStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    startTransition(async () => {
      applyOptimistic({ id: user.id, activeStatus: nextStatus });
      const result = await updateUserStatusAction(user.id, nextStatus);
      if (!result.success) {
        toast.error(result.message || "Failed to update user");
      } else {
        toast.success(`${user.name} ${nextStatus === "BLOCKED" ? "banned" : "unbanned"}`);
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 border-b p-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email..." className="pl-9" />
        </div>
        <p className="text-sm text-muted-foreground">{optimisticUsers.length} total users</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((user) => {
            const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
            const isBlocked = user.activeStatus === "BLOCKED";
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge className={ROLE_STYLES[user.role]}>{user.role}</Badge></TableCell>
                <TableCell>
                  <Badge variant={isBlocked ? "destructive" : "outline"}>
                    {isBlocked ? "Blocked" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {user.role !== "ADMIN" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => handleToggle(user)}
                      className={isBlocked ? "text-green-600 hover:text-green-600" : "text-red-600 hover:text-red-600"}
                    >
                      {isBlocked ? (<><ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Unban</>) : (<><ShieldBan className="mr-1.5 h-3.5 w-3.5" /> Ban</>)}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {paged.length === 0 && (
            <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No users found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}