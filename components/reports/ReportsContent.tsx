"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopServicesRanking } from "@/components/dashboard/TopServicesRanking";
import { StockAlertList } from "@/components/dashboard/StockAlertList";
import { EmployeeRatingList } from "./EmployeeRatingList";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";

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

interface NotaFuncionarioAPI {
  nome: string;
  cargo: string;
  total_avaliacoes: number;
  nota_media: number;
}

interface PecaAlertaAPI {
  id: string;
  nome: string;
  quantidade: number;
  quantidade_minima: number;
  deficit: number;
}

export function ReportsContent() {
  const { getToken } = useAuth();
  const [receitaMensal, setReceitaMensal] = useState<ReceitaMensalAPI[]>([]);
  const [rankingServicos, setRankingServicos] = useState<RankingServicosAPI[]>([]);
  const [notasFuncionarios, setNotasFuncionarios] = useState<NotaFuncionarioAPI[]>([]);
  const [pecasAlerta, setPecasAlerta] = useState<PecaAlertaAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    Promise.all([
      api.get<ReceitaMensalAPI[]>(API_ENDPOINTS.relatorios.receitaMensal, { token }),
      api.get<RankingServicosAPI[]>(API_ENDPOINTS.relatorios.rankingServicos, { token }),
      api.get<NotaFuncionarioAPI[]>(API_ENDPOINTS.relatorios.notaMediaFuncionarios, { token }),
      api.get<PecaAlertaAPI[]>(API_ENDPOINTS.pecas.abaixoEstoqueMinimo, { token }),
    ])
      .then(([receita, ranking, notas, alertas]) => {
        setReceitaMensal(receita);
        setRankingServicos(ranking);
        setNotasFuncionarios(notas);
        setPecasAlerta(alertas);
      })
      .catch(() => toast.error("Erro ao carregar relatórios."))
      .finally(() => setIsLoading(false));
  }, [getToken]);

  const revenueData = receitaMensal.map((r) => ({
    month: r.mes,
    revenue: Number(r.receita_total),
    laborRevenue: Number(r.receita_total),
    partsRevenue: 0,
  }));

  const servicesRanking = rankingServicos.map((s, i) => ({
    rank: i + 1,
    serviceName: s.nome,
    count: Number(s.total_execucoes),
    totalRevenue: `R$ ${Number(s.faturamento_total).toFixed(2)}`,
  }));

  const employeesRating = notasFuncionarios.map((f) => ({
    id: f.nome,
    name: f.nome,
    role: f.cargo,
    averageRating: Number(f.nota_media),
  }));

  const stockAlerts = pecasAlerta.map((p) => ({
    id: p.id,
    partName: p.nome,
    currentQty: p.quantidade,
    minQty: p.quantidade_minima,
    unit: "un",
  }));

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
        <EmployeeRatingList data={employeesRating} />
        <StockAlertList data={stockAlerts} />
      </div>
    </div>
  );
}
