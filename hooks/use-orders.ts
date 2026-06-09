import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";

export type StatusBackend =
  | "AGENDADO"
  | "EM_ANDAMENTO"
  | "CONCLUIDO"
  | "CANCELADO"
  | "NO_SHOW";

export const STATUS_LABEL: Record<StatusBackend, string> = {
  AGENDADO: "Agendado",
  EM_ANDAMENTO: "Em Andamento",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  NO_SHOW: "No-show",
};

export interface OrdemAPI {
  id: string;
  status: StatusBackend;
  km_entrada: number;
  km_saida?: number;
  aberturaEm: string;
  conclusaoEm?: string;
  observacoes?: string;
  veiculo: {
    placa: string;
    modelo: string;
  };
  _count: {
    itensServico: number;
    itensPeca: number;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

export function useOrders() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<OrdemAPI[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 50, total: 0, hasNextPage: false });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusBackend | "">("");

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: "1", limit: "50" });
      if (statusFilter) params.set("status", statusFilter);

      const data = await api.get<{ data: OrdemAPI[]; meta: PaginationMeta }>(
        `${API_ENDPOINTS.agendamentos.list}?${params}`,
        { token: getToken() }
      );
      setOrders(data.data);
      setMeta(data.meta);
    } catch {
      toast.error("Erro ao carregar ordens de serviço.");
    } finally {
      setIsLoading(false);
    }
  }, [getToken, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function updateOrderStatus(orderId: string, newStatus: StatusBackend, kmSaida?: number) {
    try {
      await api.patch(
        API_ENDPOINTS.agendamentos.updateStatus(orderId),
        { status: newStatus, km_saida: kmSaida },
        { token: getToken() }
      );
      toast.success("Status atualizado com sucesso!");
      await fetchOrders();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar o status.";
      toast.error(message);
    }
  }

  function getOrderById(id: string) {
    return orders.find((o) => o.id === id);
  }

  return {
    orders,
    meta,
    isLoading,
    statusFilter,
    setStatusFilter,
    updateOrderStatus,
    getOrderById,
    refetch: fetchOrders,
  };
}
