import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";
import { STATUS_LABEL, type StatusBackend } from "@/hooks/use-orders";
import { formatCurrency } from "@/lib/utils";
import type { KpiData, RecentOrder, StockAlert } from "@/types/dashboard";

interface DashboardKpisRaw {
  totalClientes: number;
  osAbertas: number;
  osPorStatus: Record<string, number>;
  receitaMes: number;
  receitaMesAnterior: number;
  variacaoReceita: number;
  totalOsMes: number;
  pecasAbaixoMinimo: number;
  notaMedia: number | null;
  osRecentes: {
    id: string;
    status: string;
    clienteNome: string;
    veiculo: string;
    aberturaEm: string;
    total: number;
  }[];
}

interface ReceitaMensalAPI {
  mes: string;
  total_os: number;
  receita_total: number;
  ticket_medio: number;
}

interface RankingServicosAPI {
  nome: string;
  total_execucoes: number;
  faturamento_total: number;
}

interface PecaAlertaAPI {
  id: string;
  nome: string;
  quantidade: number;
  quantidade_minima: number;
}

export function useDashboard() {
  const { getToken, user } = useAuth();
  const isGerente = user?.perfil === "GERENTE";

  const [kpiData, setKpiData] = useState<KpiData[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [revenueData, setRevenueData] = useState<
    { month: string; revenue: number; laborRevenue: number; partsRevenue: number }[]
  >([]);
  const [servicesRanking, setServicesRanking] = useState<
    { rank: number; serviceName: string; count: number; totalRevenue: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();

      // Dados básicos disponíveis para todos os perfis
      const [kpis, alertas] = await Promise.all([
        api.get<DashboardKpisRaw>(API_ENDPOINTS.dashboard.kpis, { token }),
        api.get<PecaAlertaAPI[]>(API_ENDPOINTS.pecas.abaixoEstoqueMinimo, { token }),
      ]);

      setKpiData([
        {
          label: "Clientes Cadastrados",
          value: String(kpis.totalClientes),
          change: "—",
          changeType: "neutral",
          icon: "Users",
        },
        {
          label: "OS Abertas",
          value: String(kpis.osAbertas),
          change: `${kpis.totalOsMes} no mês`,
          changeType: "neutral",
          icon: "Wrench",
        },
        {
          label: "Receita do Mês",
          value: formatCurrency(kpis.receitaMes),
          change: `${kpis.variacaoReceita >= 0 ? "+" : ""}${kpis.variacaoReceita.toFixed(1)}% vs mês anterior`,
          changeType: kpis.variacaoReceita >= 0 ? "positive" : "negative",
          icon: "TrendingUp",
        },
        {
          label: "Avaliação Média",
          value: kpis.notaMedia != null ? kpis.notaMedia.toFixed(1) : "—",
          change: "—",
          changeType: "neutral",
          icon: "Star",
        },
        {
          label: "Peças Abaixo do Mínimo",
          value: String(kpis.pecasAbaixoMinimo),
          change: kpis.pecasAbaixoMinimo > 0 ? "Reposição necessária" : "Estoque OK",
          changeType: kpis.pecasAbaixoMinimo > 0 ? "negative" : "positive",
          icon: "Package",
        },
      ]);

      setRecentOrders(
        kpis.osRecentes.map((os) => ({
          id: os.id.slice(0, 8).toUpperCase(),
          clientName: os.clienteNome,
          vehicle: os.veiculo,
          status: STATUS_LABEL[os.status as StatusBackend] as RecentOrder["status"],
          openedAt: os.aberturaEm,
          total: formatCurrency(os.total),
        }))
      );

      setStockAlerts(
        alertas.map((p) => ({
          id: p.id,
          partName: p.nome,
          currentQty: p.quantidade,
          minQty: p.quantidade_minima,
          unit: "un",
        }))
      );

      // Gráficos de relatório: apenas Gerente tem acesso aos endpoints
      if (isGerente) {
        const [receita, ranking] = await Promise.all([
          api.get<ReceitaMensalAPI[]>(API_ENDPOINTS.relatorios.receitaMensal, { token }),
          api.get<RankingServicosAPI[]>(API_ENDPOINTS.relatorios.rankingServicos, { token }),
        ]);

        setRevenueData(
          receita.map((r) => ({
            month: r.mes,
            revenue: Number(r.receita_total),
            laborRevenue: Number(r.receita_total),
            partsRevenue: 0,
          }))
        );

        setServicesRanking(
          ranking.map((s, i) => ({
            rank: i + 1,
            serviceName: s.nome,
            count: Number(s.total_execucoes),
            totalRevenue: formatCurrency(Number(s.faturamento_total)),
          }))
        );
      }
    } catch {
      toast.error("Erro ao carregar dados do dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isGerente]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    kpiData,
    recentOrders,
    stockAlerts,
    revenueData,
    servicesRanking,
    isLoading,
    isGerente,
    refetch: fetchAll,
  };
}
