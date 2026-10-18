import { SidebarProvider } from "@/components/ui/sidebar";
import { getMe } from "@/service/getMe";
import { redirect } from "next/navigation";
import DashboardSidebar from "./_components/DashboardSidebar";
import DashboardTopbar from "./_components/DashboardTopbar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();

  if (!user.success) {
    redirect("/login");
  }

  return (
    <SidebarProvider className="min-h-[calc(100svh-4rem)] flex-1">
      <DashboardSidebar role={user.data!.role} name={user.data!.name} email={user.data!.email} />
      <main className="relative isolate min-w-0 flex-1 overflow-x-clip">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-accent/40 to-transparent" />
        <DashboardTopbar role={user.data!.role} />
        <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
