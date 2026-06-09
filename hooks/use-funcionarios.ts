import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { funcionarioSchema, type FuncionarioFormValues } from "@/schema/schemaFuncionario";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";

export interface FuncionarioAPI {
  id: string;
  nome: string;
  cargo: string;
  especialidade?: string;
  salario: number;
  telefone?: string;
  data_admissao?: string;
  ativo: boolean;
  criadoEm: string;
  usuario?: {
    email: string;
    perfil: string;
  };
}

export function useFuncionarios() {
  const { getToken } = useAuth();
  const [funcionarios, setFuncionarios] = useState<FuncionarioAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<FuncionarioAPI | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cargoFilter, setCargoFilter] = useState("todos");

  const form = useForm<FuncionarioFormValues>({
    resolver: zodResolver(funcionarioSchema) as any,
    defaultValues: {
      nome: "",
      cargo: "Mecânico",
      especialidade: "",
      email: "",
      telefone: "",
      salario: 0,
      dataAdmissao: "",
      ativo: true,
    },
  });

  const { isSubmitting } = form.formState;

  const fetchFuncionarios = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.get<FuncionarioAPI[]>(API_ENDPOINTS.funcionarios.list, {
        token: getToken(),
      });
      setFuncionarios(data);
    } catch {
      toast.error("Erro ao carregar funcionários.");
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchFuncionarios();
  }, [fetchFuncionarios]);

  const filtered = useMemo(() => {
    return funcionarios.filter((f) => {
      const matchesSearch =
        searchTerm === "" ||
        f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.usuario?.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.cargo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCargo = cargoFilter === "todos" || f.cargo === cargoFilter;

      return matchesSearch && matchesCargo;
    });
  }, [funcionarios, searchTerm, cargoFilter]);

  function handleAdd() {
    setEditingFuncionario(null);
    form.reset({
      nome: "",
      cargo: "Mecânico",
      especialidade: "",
      email: "",
      telefone: "",
      salario: 0,
      dataAdmissao: new Date().toISOString().split("T")[0],
      ativo: true,
    });
    setIsDialogOpen(true);
  }

  function handleEdit(funcionario: FuncionarioAPI) {
    setEditingFuncionario(funcionario);
    form.reset({
      nome: funcionario.nome,
      cargo: funcionario.cargo,
      especialidade: funcionario.especialidade ?? "",
      email: funcionario.usuario?.email ?? "",
      telefone: funcionario.telefone ?? "",
      salario: Number(funcionario.salario),
      dataAdmissao: funcionario.data_admissao
        ? funcionario.data_admissao.split("T")[0]
        : "",
      ativo: funcionario.ativo,
    });
    setIsDialogOpen(true);
  }

  async function onSubmit(values: FuncionarioFormValues) {
    try {
      const payload = {
        nome: values.nome,
        cargo: values.cargo,
        especialidade: values.especialidade || undefined,
        salario: values.salario,
        telefone: values.telefone || undefined,
        data_admissao: values.dataAdmissao
          ? new Date(values.dataAdmissao).toISOString()
          : undefined,
        ativo: values.ativo,
        email: values.email || undefined,
        senha: undefined as string | undefined,
      };

      if (editingFuncionario) {
        await api.put(API_ENDPOINTS.funcionarios.update(editingFuncionario.id), payload, {
          token: getToken(),
        });
        toast.success("Funcionário atualizado com sucesso!");
      } else {
        await api.post(API_ENDPOINTS.funcionarios.create, payload, { token: getToken() });
        toast.success("Funcionário cadastrado com sucesso!");
      }

      setIsDialogOpen(false);
      await fetchFuncionarios();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar o funcionário.";
      toast.error(message);
    }
  }

  return {
    funcionarios: filtered,
    totalFuncionarios: funcionarios.length,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    editingFuncionario,
    form,
    isSubmitting,
    searchTerm,
    setSearchTerm,
    cargoFilter,
    setCargoFilter,
    handleAdd,
    handleEdit,
    onSubmit,
  };
}
