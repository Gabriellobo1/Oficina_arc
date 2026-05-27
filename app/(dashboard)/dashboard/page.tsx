import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Dashboard | Oficina Pro",
};

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" subtitle="Visão geral da oficina" />
      <div className="p-6">
        <DashboardContent />
      </div>
    </>
  );
}
