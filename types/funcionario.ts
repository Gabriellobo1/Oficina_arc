export type CargoFuncionario =
  | "Mecânico"
  | "Eletricista Automotivo"
  | "Funileiro"
  | "Pintor"
  | "Atendente"
  | "Gerente";

export interface Funcionario {
  id: string;
  nome: string;
  cargo: CargoFuncionario;
  especialidade?: string;
  email: string;
  telefone: string;
  salario: number;
  dataAdmissao: string;
  ativo: boolean;
  notaMedia?: number;
  totalOs?: number;
}
