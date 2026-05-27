"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopServicesRanking } from "@/components/dashboard/TopServicesRanking";
import { StockAlertList } from "@/components/dashboard/StockAlertList";
import { EmployeeRatingList } from "./EmployeeRatingList";
import type { Employee } from "@/types/models";

const MOCK_EMPLOYEES: Employee[] = [
  { id: "e1", name: "Marcos Mecânico", role: "Mecânico Sênior", averageRating: 4.8 },
  { id: "e2", name: "João Eletricista", role: "Eletricista Auto", averageRating: 4.5 },
  { id: "e3", name: "Ana Balconista", role: "Atendimento", averageRating: 4.9 },
  { id: "e4", name: "Pedro Auxiliar", role: "Auxiliar Mecânico", averageRating: 3.8 },
];

export function ReportsContent() {
  const { revenueData, servicesRanking, stockAlerts } = useDashboard();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Relatórios Gerenciais
        </h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe o desempenho da oficina em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div className="lg:col-span-1">
          <TopServicesRanking data={servicesRanking} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EmployeeRatingList data={MOCK_EMPLOYEES} />
        <StockAlertList data={stockAlerts} />
      </div>
    </div>
  );
}
