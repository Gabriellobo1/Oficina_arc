"use client";

import { KpiCardsGrid } from "@/components/dashboard/KpiCardsGrid";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopServicesRanking } from "@/components/dashboard/TopServicesRanking";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { StockAlertList } from "@/components/dashboard/StockAlertList";
import { useDashboard } from "@/hooks/use-dashboard";

export function DashboardContent() {
  const { kpiData, recentOrders, stockAlerts, revenueData, servicesRanking, isGerente } =
    useDashboard();

  return (
    <div className="flex flex-col gap-6">
      <KpiCardsGrid data={kpiData} />

      {isGerente && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RevenueChart data={revenueData} />
          </div>
          <div className="lg:col-span-2">
            <TopServicesRanking data={servicesRanking} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentOrdersTable data={recentOrders} />
        </div>
        <div className="lg:col-span-2">
          <StockAlertList data={stockAlerts} />
        </div>
      </div>
    </div>
  );
}
