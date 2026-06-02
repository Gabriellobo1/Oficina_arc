import type {
  KpiData,
  RecentOrder,
  StockAlert,
  RevenueDataPoint,
  ServiceRankingItem,
} from "@/types/dashboard";

const kpiData: KpiData[] = [
  {
    label: "Receita do Mês",
    value: "R$ 38.450,00",
    change: "+12,4%",
    changeType: "positive",
    icon: "TrendingUp",
  },
  {
    label: "OS Abertas",
    value: "12",
    change: "+3 hoje",
    changeType: "neutral",
    icon: "Wrench",
  },
  {
    label: "Clientes Cadastrados",
    value: "247",
    change: "+8 este mês",
    changeType: "positive",
    icon: "Users",
  },
  {
    label: "Ticket Médio",
    value: "R$ 420,00",
    change: "-2,1%",
    changeType: "negative",
    icon: "Receipt",
  },
];

const recentOrders: RecentOrder[] = [
  {
    id: "OS-0041",
    clientName: "João Pereira",
    vehicle: "Honda Civic 2020",
    status: "Em Andamento",
    openedAt: "26/05/2026",
    total: "R$ 850,00",
  },
  {
    id: "OS-0040",
    clientName: "Maria Silva",
    vehicle: "Toyota Corolla 2019",
    status: "Concluído",
    openedAt: "25/05/2026",
    total: "R$ 1.200,00",
  },
  {
    id: "OS-0039",
    clientName: "Carlos Mendes",
    vehicle: "VW Polo 2022",
    status: "Agendado",
    openedAt: "25/05/2026",
    total: "R$ 320,00",
  },
  {
    id: "OS-0038",
    clientName: "Auto Peças Rápidas Ltda",
    vehicle: "Ford Ranger 2021",
    status: "Concluído",
    openedAt: "24/05/2026",
    total: "R$ 2.100,00",
  },
  {
    id: "OS-0037",
    clientName: "Fernanda Costa",
    vehicle: "Fiat Pulse 2023",
    status: "Cancelado",
    openedAt: "23/05/2026",
    total: "R$ 0,00",
  },
];

const stockAlerts: StockAlert[] = [
  { id: "P001", partName: "Filtro de Óleo Premium", currentQty: 2, minQty: 10, unit: "un" },
  { id: "P002", partName: "Pastilha de Freio Dianteira", currentQty: 4, minQty: 8, unit: "jogo" },
  { id: "P003", partName: "Correia Dentada 110 dentes", currentQty: 1, minQty: 5, unit: "un" },
  { id: "P004", partName: "Fluido de Freio DOT 4", currentQty: 3, minQty: 12, unit: "L" },
];

const revenueData: RevenueDataPoint[] = [
  { month: "Dez", revenue: 28000, laborRevenue: 18000, partsRevenue: 10000 },
  { month: "Jan", revenue: 32000, laborRevenue: 21000, partsRevenue: 11000 },
  { month: "Fev", revenue: 27500, laborRevenue: 17000, partsRevenue: 10500 },
  { month: "Mar", revenue: 35000, laborRevenue: 23000, partsRevenue: 12000 },
  { month: "Abr", revenue: 34200, laborRevenue: 22500, partsRevenue: 11700 },
  { month: "Mai", revenue: 38450, laborRevenue: 25000, partsRevenue: 13450 },
];

const servicesRanking: ServiceRankingItem[] = [
  { rank: 1, serviceName: "Troca de Óleo e Filtro", count: 48, totalRevenue: "R$ 7.200,00" },
  { rank: 2, serviceName: "Alinhamento e Balanceamento", count: 31, totalRevenue: "R$ 5.580,00" },
  { rank: 3, serviceName: "Revisão de Freios", count: 22, totalRevenue: "R$ 8.800,00" },
  { rank: 4, serviceName: "Diagnóstico Eletrônico", count: 18, totalRevenue: "R$ 3.600,00" },
  { rank: 5, serviceName: "Troca de Correia Dentada", count: 12, totalRevenue: "R$ 9.600,00" },
];

export function useDashboard() {
  return {
    kpiData,
    recentOrders,
    stockAlerts,
    revenueData,
    servicesRanking,
  };
}
