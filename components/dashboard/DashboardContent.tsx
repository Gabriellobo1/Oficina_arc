"use client";

import { KpiCardsGrid } from "@/components/dashboard/KpiCardsGrid";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopServicesRanking } from "@/components/dashboard/TopServicesRanking";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { StockAlertList } from "@/components/dashboard/StockAlertList";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-dashboard";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Skeleton className="h-72 w-full rounded-xl lg:col-span-3" />
        <Skeleton className="h-72 w-full rounded-xl lg:col-span-2" />
      </div>
    </div>
  );
}

export function DashboardContent() {
  const {
    kpiData,
    recentOrders,
    stockAlerts,
    revenueData,
    servicesRanking,
    isGerente,
    isLoading,
  } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <SectionTitle>Visão Geral</SectionTitle>
        <KpiCardsGrid data={kpiData} />
      </section>

      {isGerente && (
        <section className="flex flex-col gap-4">
          <SectionTitle>Desempenho</SectionTitle>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <RevenueChart data={revenueData} />
            </div>
            <div className="lg:col-span-2">
              <TopServicesRanking data={servicesRanking} />
            </div>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <SectionTitle>Atividade Recente</SectionTitle>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RecentOrdersTable data={recentOrders} />
          </div>
          <div className="lg:col-span-2">
            <StockAlertList data={stockAlerts} />
          </div>
        </div>
      </section>
    </div>
  );
}
