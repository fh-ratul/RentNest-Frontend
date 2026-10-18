import { PageHeader, Panel } from "@/components/dashboard/page-header";
import UserTable from "@/components/dashboard/admin/user-table";
import { getAllUsers } from "../_actions/adminActions";
import { IAdminUser } from "@/lib/types";

export default async function AdminUsersPage() {
  const result = await getAllUsers();
  const users: IAdminUser[] = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="User management" description="View and manage all platform users." />
      <Panel>
        <UserTable users={users} />
      </Panel>
    </div>
  );
}