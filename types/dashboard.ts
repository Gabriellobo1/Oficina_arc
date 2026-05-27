export type OrderStatus = "Aberta" | "Em Andamento" | "Concluída" | "Cancelada";

export interface KpiData {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
}

export interface RecentOrder {
  id: string;
  clientName: string;
  vehicle: string;
  status: OrderStatus;
  openedAt: string;
  total: string;
}

export interface StockAlert {
  id: string;
  partName: string;
  currentQty: number;
  minQty: number;
  unit: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  laborRevenue: number;
  partsRevenue: number;
}

export interface ServiceRankingItem {
  rank: number;
  serviceName: string;
  count: number;
  totalRevenue: string;
}
