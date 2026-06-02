import { useState, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { partSchema, type PartFormValues } from "@/schema/schemaStock";
import type { Part } from "@/types/models";

const INITIAL_MOCK_DATA: Part[] = [
  { id: "p1", name: "Óleo do Motor 5W30", sku: "OL-5W30", currentQty: 25, minQty: 10, price: 45.0, supplier: "Lubrax" },
  { id: "p2", name: "Filtro de Óleo", sku: "FL-OL-01", currentQty: 8, minQty: 15, price: 25.0, supplier: "Mann Filter" },
  { id: "p3", name: "Pastilha de Freio Dianteira", sku: "FR-PA-01", currentQty: 4, minQty: 10, price: 120.0, supplier: "Bosch" },
  { id: "p4", name: "Correia Dentada", sku: "CO-DE-01", currentQty: 12, minQty: 5, price: 85.0, supplier: "Gates" },
  { id: "p5", name: "Bateria 60Ah", sku: "BA-60-01", currentQty: 3, minQty: 5, price: 350.0, supplier: "Moura" },
  { id: "p6", name: "Vela de Ignição", sku: "VE-IG-01", currentQty: 0, minQty: 8, price: 35.0, supplier: "Bosch" },
  { id: "p7", name: "Fluido de Freio DOT 4", sku: "FL-FR-01", currentQty: 6, minQty: 12, price: 22.0, supplier: "Lubrax" },
  { id: "p8", name: "Amortecedor Dianteiro", sku: "AM-DI-01", currentQty: 2, minQty: 4, price: 280.0, supplier: "Monroe" },
];

export interface StockFilters {
  supplierFilter: string;
  priceMin: string;
  priceMax: string;
}

export function useStock() {
  const [parts, setParts] = useState<Part[]>(INITIAL_MOCK_DATA);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [filters, setFilters] = useState<StockFilters>({
    supplierFilter: "",
    priceMin: "",
    priceMax: "",
  });

  const form = useForm<PartFormValues>({
    resolver: zodResolver(partSchema) as any,
    defaultValues: {
      name: "",
      sku: "",
      currentQty: 0,
      minQty: 1,
      price: 0,
      supplier: "",
    },
  });

  const { isSubmitting } = form.formState;

  const suppliers = useMemo(() => {
    const set = new Set(parts.map((p) => p.supplier).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [parts]);

  const filteredParts = useMemo(() => {
    return parts.filter((p) => {
      if (filters.supplierFilter && p.supplier !== filters.supplierFilter) return false;

      const min = parseFloat(filters.priceMin);
      const max = parseFloat(filters.priceMax);

      if (!isNaN(min) && p.price < min) return false;
      if (!isNaN(max) && p.price > max) return false;

      return true;
    });
  }, [parts, filters]);

  function handleAdd() {
    setEditingPart(null);
    form.reset({ name: "", sku: "", currentQty: 0, minQty: 1, price: 0, supplier: "" });
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
      supplier: part.supplier ?? "",
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
        const newPart: Part = { id: `p${Date.now()}`, ...values };
        setParts((prev) => [...prev, newPart]);
        toast.success("Peça adicionada ao estoque!");
      }

      setIsDialogOpen(false);
    } catch {
      toast.error("Ocorreu um erro ao salvar a peça.");
    }
  }

  function setSupplierFilter(value: string) {
    setFilters((prev) => ({ ...prev, supplierFilter: value }));
  }

  function setPriceMin(value: string) {
    setFilters((prev) => ({ ...prev, priceMin: value }));
  }

  function setPriceMax(value: string) {
    setFilters((prev) => ({ ...prev, priceMax: value }));
  }

  function resetFilters() {
    setFilters({ supplierFilter: "", priceMin: "", priceMax: "" });
  }

  return {
    filteredParts,
    suppliers,
    filters,
    setSupplierFilter,
    setPriceMin,
    setPriceMax,
    resetFilters,
    isDialogOpen,
    setIsDialogOpen,
    form,
    isSubmitting,
    handleAdd,
    handleEdit,
    onSubmit,
    editingPart,
  };
}
