// Templates remount on every navigation, so each dashboard page eases in
// while the sidebar and top bar stay put.
export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
