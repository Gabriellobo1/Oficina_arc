"use client";

import { Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FuncionariosTable } from "./FuncionariosTable";
import { FuncionarioFormDialog } from "./FuncionarioFormDialog";
import { useFuncionarios } from "@/hooks/use-funcionarios";
import { CARGOS_FUNCIONARIO } from "@/schema/schemaFuncionario";

export function FuncionariosContent() {
  const {
    funcionarios,
    totalFuncionarios,
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
  } = useFuncionarios();

  const ativos = funcionarios.filter((f) => f.ativo).length;

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Funcionários
          </h1>
          <p className="text-sm text-muted-foreground">
            {totalFuncionarios} funcionários cadastrados · {ativos} ativos
          </p>
        </div>
        <Button
          id="btn-novo-funcionario"
          onClick={handleAdd}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: totalFuncionarios, color: "text-foreground" },
          { label: "Ativos", value: ativos, color: "text-emerald-500" },
          {
            label: "Mecânicos",
            value: funcionarios.filter((f) => f.cargo === "Mecânico").length,
            color: "text-blue-400",
          },
          {
            label: "Nota Média",
            value:
              funcionarios.filter((f) => f.notaMedia).length > 0
                ? (
                    funcionarios
                      .filter((f) => f.notaMedia)
                      .reduce((acc, f) => acc + (f.notaMedia ?? 0), 0) /
                    funcionarios.filter((f) => f.notaMedia).length
                  ).toFixed(1)
                : "—",
            color: "text-amber-400",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card flex flex-col gap-1 rounded-xl p-4">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="func-search"
            placeholder="Buscar por nome, cargo ou e-mail..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={cargoFilter} onValueChange={(v) => setCargoFilter(v ?? "todos")}>
          <SelectTrigger id="func-cargo-filter" className="w-full sm:w-52">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filtrar cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os cargos</SelectItem>
            {CARGOS_FUNCIONARIO.map((cargo) => (
              <SelectItem key={cargo} value={cargo}>
                {cargo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <FuncionariosTable funcionarios={funcionarios} onEdit={handleEdit} />

      {/* Dialog de cadastro/edição */}
      <FuncionarioFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form as any}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        editingFuncionario={editingFuncionario}
      />
    </div>
  );
}
