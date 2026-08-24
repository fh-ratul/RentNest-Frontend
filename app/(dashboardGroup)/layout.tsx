import { Navbar } from "@/components/shared/navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getMe } from "@/service/getMe";
import { redirect } from "next/navigation";
import DashboardSidebar from "./_components/DashboardSidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();

  if (!user.success) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-4rem)] flex-1">
        <DashboardSidebar
          role={user.data!.role}
          name={user.data!.name}
          email={user.data!.email}
        />
        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 md:hidden">
            <SidebarTrigger />
            <span className="text-sm font-medium text-muted-foreground">Menu</span>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
