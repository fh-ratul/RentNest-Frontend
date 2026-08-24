import { Card } from "@/components/ui/card";
import UserTable from "@/components/dashboard/admin/user-table";
import { getAllUsers } from "../_actions/adminActions";
import { IAdminUser } from "@/lib/types";

export default async function AdminUsersPage() {
  const result = await getAllUsers();
  const users: IAdminUser[] = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">User Management</h1>
        <p className="text-muted-foreground">View and manage all platform users.</p>
      </div>
      <Card className="overflow-hidden py-0">
        <UserTable users={users} />
      </Card>
    </div>
  );
}