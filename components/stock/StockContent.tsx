"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockTable } from "./StockTable";
import { StockFormDialog } from "./StockFormDialog";
import { useStock } from "@/hooks/use-stock";

export function StockContent() {
  const {
    parts,
    isDialogOpen,
    setIsDialogOpen,
    form,
    isSubmitting,
    handleAdd,
    handleEdit,
    onSubmit,
  } = useStock();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Estoque de Peças
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie o inventário e receba alertas de reposição.
          </p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Peça
        </Button>
      </div>

      <StockTable parts={parts} onEdit={handleEdit} />

      <StockFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form as any}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        isEditing={!!form.getValues("sku") && parts.some(p => p.sku === form.getValues("sku"))}
      />
    </div>
  );
}
