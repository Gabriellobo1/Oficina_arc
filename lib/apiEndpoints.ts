export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    me: "/api/auth/me",
    refresh: "/api/auth/refresh",
  },

  dashboard: {
    kpis: "/api/dashboard",
  },

  clientes: {
    list: "/api/clientes",
    create: "/api/clientes",
    getById: (id: string) => `/api/clientes/${id}`,
    update: (id: string) => `/api/clientes/${id}`,
    delete: (id: string) => `/api/clientes/${id}`,
  },

  veiculos: {
    list: "/api/veiculos",
    create: "/api/veiculos",
    getByPlaca: (placa: string) => `/api/veiculos/${placa}`,
  },

  funcionarios: {
    list: "/api/funcionarios",
    create: "/api/funcionarios",
    getById: (id: string) => `/api/funcionarios/${id}`,
    update: (id: string) => `/api/funcionarios/${id}`,
    delete: (id: string) => `/api/funcionarios/${id}`,
  },

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

  pecas: {
    list: "/api/pecas",
    create: "/api/pecas",
    getById: (id: string) => `/api/pecas/${id}`,
    update: (id: string) => `/api/pecas/${id}`,
    delete: (id: string) => `/api/pecas/${id}`,
    abaixoEstoqueMinimo: "/api/pecas/abaixo-estoque-minimo",
  },

  tipoServico: {
    list: "/api/tipo-servico",
    create: "/api/tipo-servico",
    getById: (id: string) => `/api/tipo-servico/${id}`,
    update: (id: string) => `/api/tipo-servico/${id}`,
    delete: (id: string) => `/api/tipo-servico/${id}`,
  },

  relatorios: {
    receitaMensal: "/api/relatorios/receita-mensal",
    rankingServicos: "/api/relatorios/ranking-servicos",
    rankingFuncionarios: "/api/relatorios/ranking-funcionarios",
    notaMediaFuncionarios: "/api/relatorios/nota-media-funcionarios",
  },
} as const;
