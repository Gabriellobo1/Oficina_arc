import { Sidebar } from "@/components/layout/Sidebar";
import { RouteGuard } from "@/components/layout/RouteGuard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <RouteGuard>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </RouteGuard>
  );
}
