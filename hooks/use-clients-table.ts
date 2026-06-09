import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";

export interface ClienteAPI {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  tipo: "PF" | "PJ";
  cpf?: string;
  cnpj?: string;
  endereco?: string;
  criadoEm: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

type TypeFilter = "all" | "PF" | "PJ";

export function useClientsTable() {
  const { getToken } = useAuth();
  const [clientes, setClientes] = useState<ClienteAPI[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 20, total: 0, hasNextPage: false });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [page, setPage] = useState(1);

  const fetchClientes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (searchTerm) params.set("nome", searchTerm);
      if (typeFilter !== "all") params.set("tipo", typeFilter);

      const data = await api.get<{ data: ClienteAPI[]; meta: PaginationMeta }>(
        `${API_ENDPOINTS.clientes.list}?${params}`,
        { token: getToken() }
      );
      setClientes(data.data);
      setMeta(data.meta);
    } catch {
      toast.error("Erro ao carregar clientes.");
    } finally {
      setIsLoading(false);
    }
  }, [getToken, page, searchTerm, typeFilter]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  function handleSearch(term: string) {
    setSearchTerm(term);
    setPage(1);
  }

  function handleTypeFilter(type: TypeFilter) {
    setTypeFilter(type);
    setPage(1);
  }

  return {
    clientes,
    meta,
    isLoading,
    searchTerm,
    setSearchTerm: handleSearch,
    typeFilter,
    setTypeFilter: handleTypeFilter,
    page,
    setPage,
    refetch: fetchClientes,
  };
}
