import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";
import type { StatusBackend } from "@/hooks/use-orders";

export interface ItemServicoAPI {
  id: string;
  quantidade: number;
  preco_unitario: number;
  desconto: number;
  tipoServico: { id: string; nome: string };
  funcionario: { id: string; nome: string; cargo: string };
}

export interface ItemPecaAPI {
  id: string;
  quantidade: number;
  preco_unitario: number;
  desconto: number;
  peca: { id: string; nome: string };
}

export interface OrdemDetalheAPI {
  id: string;
  status: StatusBackend;
  km_entrada: number;
  km_saida?: number;
  aberturaEm: string;
  conclusaoEm?: string;
  observacoes?: string;
  veiculo: {
    id: string;
    placa: string;
    modelo: string;
    marca: string;
    cliente: { id: string; nome: string };
  };
  itensServico: ItemServicoAPI[];
  itensPeca: ItemPecaAPI[];
  pagamento?: {
    id: string;
    valor_total: number;
    forma_pagamento: string;
    parcelas: number;
    status: string;
  };
  avaliacao?: {
    id: string;
    nota: number;
    comentario?: string;
  };
}

export function useOrderDetail(id: string) {
  const { getToken } = useAuth();
  const [order, setOrder] = useState<OrdemDetalheAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get<OrdemDetalheAPI>(API_ENDPOINTS.agendamentos.getById(id), {
        token: getToken(),
      });
      setOrder(data);
    } catch {
      setError("Ordem de serviço não encontrada.");
    } finally {
      setIsLoading(false);
    }
  }, [id, getToken]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function registrarPagamento(payload: {
    valor_total: number;
    forma_pagamento: string;
    parcelas: number;
  }) {
    await api.post(API_ENDPOINTS.agendamentos.registrarPagamento(id), payload, {
      token: getToken(),
    });
    await fetchOrder();
  }

  async function adicionarItemServico(payload: {
    tipoServicoId: string;
    funcionarioId: string;
    quantidade: number;
    preco_unitario: number;
  }) {
    await api.post(API_ENDPOINTS.agendamentos.addServico(id), payload, {
      token: getToken(),
    });
    await fetchOrder();
  }

  async function adicionarItemPeca(payload: {
    pecaId: string;
    quantidade: number;
    preco_unitario: number;
  }) {
    await api.post(API_ENDPOINTS.agendamentos.addPeca(id), payload, {
      token: getToken(),
    });
    await fetchOrder();
  }

  return {
    order,
    isLoading,
    error,
    refetch: fetchOrder,
    registrarPagamento,
    adicionarItemServico,
    adicionarItemPeca,
  };
}
