# Oficina Pro — Frontend

Interface web do sistema de gestão para oficinas mecânicas, desenvolvida em **Next.js 15** com TypeScript. Consome a API REST do backend via `fetch` e armazena JWT em memória (React state), nunca em `localStorage`.

---

## 🏗️ Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS + shadcn/ui |
| Formulários | React Hook Form + Zod |
| Notificações | Sonner |
| Ícones | Lucide React |

---

## 📁 Estrutura de pastas relevante

```
frontend/
├── app/
│   ├── (auth)/login/         # Tela de login
│   └── (dashboard)/
│       ├── dashboard/        # Dashboard gerencial
│       ├── clientes/         # Cadastro e listagem de clientes
│       ├── veiculos/         # Veículos vinculados
│       ├── ordens-de-servico/# Kanban + detalhes da OS
│       ├── pecas/            # Estoque de peças
│       ├── funcionarios/     # Gestão de funcionários (Gerente)
│       ├── relatorios/       # Relatórios analíticos (Gerente)
│       └── acesso-negado/    # Tela de acesso negado
├── components/               # Componentes reutilizáveis
├── contexts/AuthContext.tsx  # JWT em memória (sem localStorage)
├── hooks/                    # Lógica de negócio e estado
├── lib/
│   ├── api.ts                # Cliente HTTP centralizado
│   └── apiEndpoints.ts       # Constantes dos endpoints REST
├── schema/                   # Schemas Zod de validação
└── types/                    # Tipos TypeScript
```

---

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# URL base do backend (sem barra no final)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> **Produção:** crie `.env.production` com a URL do servidor de produção.

---

## 🚀 Como executar localmente

### Pré-requisitos
- Node.js 20+ instalado
- Backend rodando (ver pasta `backend/` do repositório)
- Banco PostgreSQL configurado e scripts SQL executados

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/<usuario>/<repo>.git
cd <repo>/frontend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local e defina NEXT_PUBLIC_API_URL

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Autenticação

- O token JWT é retornado pelo endpoint `POST /api/auth/login`
- **Armazenamento:** variável de estado React (`AuthContext`) — **nunca** `localStorage` ou `sessionStorage`
- **Perfis de acesso:**
  - `atendente` — abre OS, adiciona serviços/peças, registra pagamento e avaliação
  - `gerente` — acesso completo: relatórios, funcionários e todos os agendamentos

---

## 🛣️ Rotas protegidas

| Rota | Acesso |
|------|--------|
| `/login` | Público |
| `/dashboard` | Autenticado |
| `/clientes` | Autenticado |
| `/veiculos` | Autenticado |
| `/ordens-de-servico` | Autenticado |
| `/pecas` | Autenticado |
| `/funcionarios` | **Gerente** |
| `/relatorios` | **Gerente** |

Usuários sem o perfil adequado são redirecionados para `/acesso-negado`.

---

## 📋 Telas implementadas

| Tela | Descrição |
|------|-----------|
| Login | Autenticação com JWT |
| Dashboard | KPIs, gráfico de receita, alertas de estoque |
| Clientes | Cadastro PF/PJ, busca, paginação |
| Veículos | Listagem e cadastro por cliente |
| Ordens de Serviço | Kanban por status, detalhes, pagamento, avaliação |
| Peças / Estoque | Tabela com alertas de mínimo, CRUD |
| Funcionários | Tabela com nota média e OS atendidas (Gerente) |
| Relatórios | Receita mensal, ranking de serviços, avaliações (Gerente) |

---

## 🏗️ Build de produção

```bash
npm run build
npm start
```

---

## 📂 Repositório completo

```
/
├── db/          # Scripts SQL (DDL, dados, consultas, índices)
├── backend/     # API REST (Spring Boot / FastAPI)
├── frontend/    # Este projeto
└── docs/        # Relatório EXPLAIN ANALYZE + Swagger UI
```

---

## 👥 Integrantes

| Nome | Matrícula | Responsabilidade |
|------|-----------|-----------------|
| (preencher) | | Frontend + Autenticação |
| (preencher) | | Backend + API REST |
| (preencher) | | Banco de Dados (DDL + Dados) |
| (preencher) | | Otimização (EXPLAIN ANALYZE) |
