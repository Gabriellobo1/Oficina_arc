import { useState, useEffect } from "react";
import type { ClientWithVehicles } from "@/types/client";

const MOCK_CLIENT_DETAIL: Record<string, ClientWithVehicles> = {
  "1": {
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
    vehicles: [
      {
        id: "v1",
        clientId: "1",
        brand: "Toyota",
        model: "Corolla",
        year: 2021,
        plate: "ABC1D23",
        color: "Prata",
        appointments: [
          {
            id: "a1",
            vehicleId: "v1",
            date: "2025-06-10",
            time: "09:00",
            serviceType: "Revisão Geral",
            description: "Revisão dos 30.000 km",
            status: "Concluído",
          },
          {
            id: "a2",
            vehicleId: "v1",
            date: "2025-09-15",
            time: "14:00",
            serviceType: "Troca de Óleo",
            status: "Agendado",
          },
        ],
      },
      {
        id: "v2",
        clientId: "1",
        brand: "Honda",
        model: "Civic",
        year: 2019,
        plate: "XYZ9876",
        color: "Preto",
        appointments: [
          {
            id: "a3",
            vehicleId: "v2",
            date: "2025-07-20",
            time: "10:30",
            serviceType: "Alinhamento e Balanceamento",
            status: "Concluído",
          },
        ],
      },
    ],
  },
  "2": {
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
    vehicles: [
      {
        id: "v3",
        clientId: "2",
        brand: "Volkswagen",
        model: "Delivery",
        year: 2022,
        plate: "DEF4G56",
        color: "Branco",
        appointments: [
          {
            id: "a4",
            vehicleId: "v3",
            date: "2025-08-05",
            time: "08:00",
            serviceType: "Sistema Elétrico",
            status: "Em Andamento",
          },
        ],
      },
    ],
  },
};

export function useClientDetail(id: string) {
  const [client, setClient] = useState<ClientWithVehicles | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setClient(MOCK_CLIENT_DETAIL[id] ?? null);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  return { client, isLoading };
}
