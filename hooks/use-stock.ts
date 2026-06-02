import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { partSchema, type PartFormValues } from "@/schema/schemaStock";
import type { Part } from "@/types/models";

const INITIAL_MOCK_DATA: Part[] = [
  { id: "p1", name: "Óleo do Motor 5W30", sku: "OL-5W30", currentQty: 25, minQty: 10, price: 45.0 },
  { id: "p2", name: "Filtro de Óleo", sku: "FL-OL-01", currentQty: 8, minQty: 15, price: 25.0 },
  { id: "p3", name: "Pastilha de Freio Dianteira", sku: "FR-PA-01", currentQty: 4, minQty: 10, price: 120.0 },
  { id: "p4", name: "Correia Dentada", sku: "CO-DE-01", currentQty: 12, minQty: 5, price: 85.0 },
  { id: "p5", name: "Bateria 60Ah", sku: "BA-60-01", currentQty: 3, minQty: 5, price: 350.0 },
];

export function useStock() {
  const [parts, setParts] = useState<Part[]>(INITIAL_MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);

  const form = useForm<PartFormValues>({
    resolver: zodResolver(partSchema) as any,
    defaultValues: {
      name: "",
      sku: "",
      currentQty: 0,
      minQty: 1,
      price: 0,
    },
  });

  const { isSubmitting } = form.formState;

  function handleAdd() {
    setEditingPart(null);
    form.reset({ name: "", sku: "", currentQty: 0, minQty: 1, price: 0 });
    setIsDialogOpen(true);
  }

  function handleEdit(part: Part) {
    setEditingPart(part);
    form.reset({
      name: part.name,
      sku: part.sku,
      currentQty: part.currentQty,
      minQty: part.minQty,
      price: part.price,
    });
    setIsDialogOpen(true);
  }

  async function onSubmit(values: PartFormValues) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (editingPart) {
        setParts((prev) =>
          prev.map((p) => (p.id === editingPart.id ? { ...p, ...values } : p))
        );
        toast.success("Peça atualizada com sucesso!");
      } else {
        const newPart: Part = {
          id: `p${Date.now()}`,
          ...values,
        };
        setParts((prev) => [...prev, newPart]);
        toast.success("Peça adicionada ao estoque!");
      }

      setIsDialogOpen(false);
    } catch {
      toast.error("Ocorreu um erro ao salvar a peça.");
    }
  }

  return {
    parts,
    isDialogOpen,
    setIsDialogOpen,
    form,
    isSubmitting,
    handleAdd,
    handleEdit,
    onSubmit,
  };
}
