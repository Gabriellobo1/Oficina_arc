/**
 * Endpoints da API REST do backend.
 * Altere BASE_URL conforme o ambiente (dev/prod).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: "/api/auth/login",
    refresh: "/api/auth/refresh",
  },

  // Clientes
  clientes: {
    list: "/api/clientes",
    create: "/api/clientes",
    getById: (id: string) => `/api/clientes/${id}`,
    update: (id: string) => `/api/clientes/${id}`,
    delete: (id: string) => `/api/clientes/${id}`,
  },

  // Veículos
  veiculos: {
    create: "/api/veiculos",
    getByPlaca: (placa: string) => `/api/veiculos/${placa}`,
  },

  // Funcionários
  funcionarios: {
    list: "/api/funcionarios",
    create: "/api/funcionarios",
    getById: (id: string) => `/api/funcionarios/${id}`,
    update: (id: string) => `/api/funcionarios/${id}`,
    delete: (id: string) => `/api/funcionarios/${id}`,
  },

  // Agendamentos / Ordens de Serviço
  agendamentos: {
    list: "/api/agendamentos",
    create: "/api/agendamentos",
    getById: (id: string) => `/api/agendamentos/${id}`,
    updateStatus: (id: string) => `/api/agendamentos/${id}/status`,
    addServico: (id: string) => `/api/agendamentos/${id}/itens-servico`,
    addPeca: (id: string) => `/api/agendamentos/${id}/itens-peca`,
    registrarPagamento: (id: string) => `/api/agendamentos/${id}/pagamento`,
    registrarAvaliacao: (id: string) => `/api/agendamentos/${id}/avaliacao`,
  },

  // Peças / Estoque
  pecas: {
    list: "/api/pecas",
    create: "/api/pecas",
    getById: (id: string) => `/api/pecas/${id}`,
    update: (id: string) => `/api/pecas/${id}`,
    delete: (id: string) => `/api/pecas/${id}`,
    abaixoEstoqueMinimo: "/api/pecas/abaixo-estoque-minimo",
  },

  // Relatórios
  relatorios: {
    receitaMensal: "/api/relatorios/receita-mensal",
    rankingServicos: "/api/relatorios/ranking-servicos",
  },
} as const;
