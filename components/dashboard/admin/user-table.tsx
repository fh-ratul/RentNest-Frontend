"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { IAdminUser } from "@/lib/types";
import StatusBadge from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-menu";
import { ROLE_TONE } from "@/lib/tones";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/shared/table-pagination";
import { useClientTable } from "@/hooks/use-client-table";
import { updateUserStatusAction } from "@/app/(dashboardGroup)/dashboard/admin/_actions/adminActions";
import { Search, ShieldBan, ShieldCheck } from "lucide-react";

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
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email..." className="h-10 pl-10" />
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
            const isBlocked = user.activeStatus === "BLOCKED";
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} className="size-8" />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><StatusBadge status={user.role} tone={ROLE_TONE[user.role]} /></TableCell>
                <TableCell>
                  <StatusBadge status={user.activeStatus} tone={isBlocked ? "danger" : "success"} />
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
                      className={isBlocked ? "text-success hover:border-success/40 hover:bg-success/10 hover:text-success" : "text-destructive hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"}
                    >
                      {isBlocked ? (<><ShieldCheck className="size-3.5" /> Unban</>) : (<><ShieldBan className="size-3.5" /> Ban</>)}
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