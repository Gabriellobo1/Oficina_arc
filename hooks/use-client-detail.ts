import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";

export interface VeiculoAPI {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor?: string;
  clienteId: string;
  criadoEm: string;
}

export interface ClienteDetalheAPI {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  tipo: "PF" | "PJ";
  cpf?: string;
  cnpj?: string;
  endereco?: string;
  criadoEm: string;
  veiculos: VeiculoAPI[];
}

export function useClientDetail(id: string) {
  const { getToken } = useAuth();
  const [client, setClient] = useState<ClienteDetalheAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    api
      .get<ClienteDetalheAPI>(API_ENDPOINTS.clientes.getById(id), { token: getToken() })
      .then(setClient)
      .catch(() => setError("Cliente não encontrado."))
      .finally(() => setIsLoading(false));
  }, [id, getToken]);

  return { client, isLoading, error };
}
