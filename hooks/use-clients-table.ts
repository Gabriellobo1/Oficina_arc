import { useState, useMemo } from "react";
import type { Client } from "@/types/client";

const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    type: "pf",
    name: "Carlos Eduardo Souza",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    email: "carlos.souza@email.com",
    phone: "(11) 98765-4321",
    address: {
      zipCode: "01310-100",
      street: "Av. Paulista",
      number: "1000",
      complement: "Apto 42",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
    },
    createdAt: "2025-01-10",
  },
  {
    id: "2",
    type: "pj",
    companyName: "Transportes Rápido Ltda",
    tradeName: "Rápido Express",
    cnpj: "12.345.678/0001-90",
    stateRegistration: "123.456.789.000",
    email: "contato@rapidoexpress.com",
    phone: "(11) 3333-4444",
    address: {
      zipCode: "04543-011",
      street: "Av. Brigadeiro Faria Lima",
      number: "3477",
      neighborhood: "Itaim Bibi",
      city: "São Paulo",
      state: "SP",
    },
    createdAt: "2025-02-15",
  },
  {
    id: "3",
    type: "pf",
    name: "Ana Paula Ferreira",
    cpf: "987.654.321-00",
    email: "ana.ferreira@email.com",
    phone: "(21) 99988-7766",
    address: {
      zipCode: "20040-020",
      street: "Av. Rio Branco",
      number: "156",
      neighborhood: "Centro",
      city: "Rio de Janeiro",
      state: "RJ",
    },
    createdAt: "2025-03-05",
  },
  {
    id: "4",
    type: "pj",
    companyName: "Mecânica Industrial Norte S.A.",
    tradeName: "Norte Mecânica",
    cnpj: "98.765.432/0001-10",
    email: "financeiro@norteメcanica.com",
    phone: "(51) 3232-1010",
    address: {
      zipCode: "90040-060",
      street: "Av. Borges de Medeiros",
      number: "800",
      neighborhood: "Praia de Belas",
      city: "Porto Alegre",
      state: "RS",
    },
    createdAt: "2025-04-22",
  },
  {
    id: "5",
    type: "pf",
    name: "Roberto Alves Lima",
    cpf: "456.789.123-00",
    email: "roberto.lima@email.com",
    phone: "(31) 97654-3210",
    address: {
      zipCode: "30130-110",
      street: "Av. Afonso Pena",
      number: "3000",
      neighborhood: "Centro",
      city: "Belo Horizonte",
      state: "MG",
    },
    createdAt: "2025-05-01",
  },
];

type TypeFilter = "all" | "pf" | "pj";

export function useClientsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [isLoading] = useState(false);

  const clients = useMemo(() => {
    return MOCK_CLIENTS.filter((client) => {
      const matchesType = typeFilter === "all" || client.type === typeFilter;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        client.name?.toLowerCase().includes(searchLower) ||
        client.companyName?.toLowerCase().includes(searchLower) ||
        client.tradeName?.toLowerCase().includes(searchLower) ||
        client.cpf?.includes(searchTerm) ||
        client.cnpj?.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchLower);

      return matchesType && matchesSearch;
    });
  }, [searchTerm, typeFilter]);

  return {
    clients,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    isLoading,
  };
}
