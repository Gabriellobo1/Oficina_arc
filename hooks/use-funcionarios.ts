import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { funcionarioSchema, type FuncionarioFormValues } from "@/schema/schemaFuncionario";
import type { Funcionario } from "@/types/funcionario";

const MOCK_FUNCIONARIOS: Funcionario[] = [
  {
    id: "f1",
    nome: "Marcos Antônio Silva",
    cargo: "Mecânico",
    especialidade: "Motor e Transmissão",
    email: "marcos.silva@oficina.com",
    telefone: "(84) 99876-5432",
    salario: 3800,
    dataAdmissao: "2022-03-15",
    ativo: true,
    notaMedia: 4.8,
    totalOs: 312,
  },
  {
    id: "f2",
    nome: "João Carlos Pereira",
    cargo: "Eletricista Automotivo",
    especialidade: "Sistemas Elétricos e AR",
    email: "joao.pereira@oficina.com",
    telefone: "(84) 98765-1234",
    salario: 3500,
    dataAdmissao: "2021-07-01",
    ativo: true,
    notaMedia: 4.5,
    totalOs: 241,
  },
  {
    id: "f3",
    nome: "Ana Luísa Ferreira",
    cargo: "Atendente",
    email: "ana.ferreira@oficina.com",
    telefone: "(84) 97654-3210",
    salario: 2200,
    dataAdmissao: "2023-01-10",
    ativo: true,
    notaMedia: 4.9,
    totalOs: 180,
  },
  {
    id: "f4",
    nome: "Pedro Henrique Santos",
    cargo: "Mecânico",
    especialidade: "Freios e Suspensão",
    email: "pedro.santos@oficina.com",
    telefone: "(84) 96543-2109",
    salario: 3200,
    dataAdmissao: "2020-11-20",
    ativo: true,
    notaMedia: 3.8,
    totalOs: 198,
  },
  {
    id: "f5",
    nome: "Lucas Rodrigues Lima",
    cargo: "Funileiro",
    especialidade: "Funilaria e Pintura",
    email: "lucas.lima@oficina.com",
    telefone: "(84) 95432-1098",
    salario: 2900,
    dataAdmissao: "2023-06-05",
    ativo: false,
    notaMedia: 4.2,
    totalOs: 67,
  },
];

export function useFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(MOCK_FUNCIONARIOS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
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

  const filtered = useMemo(() => {
    return funcionarios.filter((f) => {
      const matchesSearch =
        searchTerm === "" ||
        f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  function handleEdit(funcionario: Funcionario) {
    setEditingFuncionario(funcionario);
    form.reset({
      nome: funcionario.nome,
      cargo: funcionario.cargo,
      especialidade: funcionario.especialidade ?? "",
      email: funcionario.email,
      telefone: funcionario.telefone,
      salario: funcionario.salario,
      dataAdmissao: funcionario.dataAdmissao,
      ativo: funcionario.ativo,
    });
    setIsDialogOpen(true);
  }

  async function onSubmit(values: FuncionarioFormValues) {
    try {
      // Stub — substituir por chamada à API: POST /api/funcionarios ou PUT /api/funcionarios/:id
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (editingFuncionario) {
        setFuncionarios((prev) =>
          prev.map((f) =>
            f.id === editingFuncionario.id ? { ...f, ...values } : f
          )
        );
        toast.success("Funcionário atualizado com sucesso!");
      } else {
        const novo: Funcionario = {
          id: `f${Date.now()}`,
          ...values,
          notaMedia: undefined,
          totalOs: 0,
        };
        setFuncionarios((prev) => [...prev, novo]);
        toast.success("Funcionário cadastrado com sucesso!");
      }

      setIsDialogOpen(false);
    } catch {
      toast.error("Erro ao salvar o funcionário. Tente novamente.");
    }
  }

  return {
    funcionarios: filtered,
    totalFuncionarios: funcionarios.length,
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
