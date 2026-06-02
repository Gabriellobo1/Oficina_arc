import { z } from "zod";

export const CARGOS_FUNCIONARIO = [
  "Mecânico",
  "Eletricista Automotivo",
  "Funileiro",
  "Pintor",
  "Atendente",
  "Gerente",
] as const;

export const funcionarioSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cargo: z.enum(CARGOS_FUNCIONARIO, {
    error: "Selecione um cargo",
  }),
  especialidade: z.string().optional(),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido (mínimo 10 dígitos)"),
  // Salário > 0 conforme regra de negócio do banco (Seção 3.2)
  salario: z.coerce
    .number()
    .min(0.01, "Salário deve ser maior que zero"),
  dataAdmissao: z.string().min(1, "Data de admissão é obrigatória"),
  ativo: z.boolean().default(true),
});

export type FuncionarioFormValues = z.infer<typeof funcionarioSchema>;
