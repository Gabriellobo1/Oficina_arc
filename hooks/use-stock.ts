import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { partSchema, type PartFormValues } from "@/schema/schemaStock";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";

export interface PecaAPI {
  id: string;
  nome: string;
  descricao?: string;
  preco_unitario: number;
  quantidade: number;
  quantidade_minima: number;
  fornecedor?: string;
  criadoEm: string;
}

export interface StockFilters {
  supplierFilter: string;
  priceMin: string;
  priceMax: string;
}

export function useStock() {
  const { getToken } = useAuth();
  const [pecas, setPecas] = useState<PecaAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPeca, setEditingPeca] = useState<PecaAPI | null>(null);
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

  const fetchPecas = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.get<PecaAPI[]>(API_ENDPOINTS.pecas.list, { token: getToken() });
      setPecas(data);
    } catch {
      toast.error("Erro ao carregar peças.");
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchPecas();
  }, [fetchPecas]);

  const suppliers = useMemo(() => {
    const set = new Set(pecas.map((p) => p.fornecedor).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [pecas]);

  const filteredPecas = useMemo(() => {
    return pecas.filter((p) => {
      if (filters.supplierFilter && p.fornecedor !== filters.supplierFilter) return false;
      const min = parseFloat(filters.priceMin);
      const max = parseFloat(filters.priceMax);
      if (!isNaN(min) && p.preco_unitario < min) return false;
      if (!isNaN(max) && p.preco_unitario > max) return false;
      return true;
    });
  }, [pecas, filters]);

  function handleAdd() {
    setEditingPeca(null);
    form.reset({ name: "", sku: "", currentQty: 0, minQty: 1, price: 0, supplier: "" });
    setIsDialogOpen(true);
  }

  function handleEdit(peca: PecaAPI) {
    setEditingPeca(peca);
    form.reset({
      name: peca.nome,
      sku: "",
      currentQty: peca.quantidade,
      minQty: peca.quantidade_minima,
      price: peca.preco_unitario,
      supplier: peca.fornecedor ?? "",
    });
    setIsDialogOpen(true);
  }

  async function onSubmit(values: PartFormValues) {
    try {
      const payload = {
        nome: values.name,
        preco_unitario: values.price,
        quantidade: values.currentQty,
        quantidade_minima: values.minQty,
        fornecedor: values.supplier,
      };

      if (editingPeca) {
        await api.put(API_ENDPOINTS.pecas.update(editingPeca.id), payload, {
          token: getToken(),
        });
        toast.success("Peça atualizada com sucesso!");
      } else {
        await api.post(API_ENDPOINTS.pecas.create, payload, { token: getToken() });
        toast.success("Peça adicionada ao estoque!");
      }

      setIsDialogOpen(false);
      await fetchPecas();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar a peça.";
      toast.error(message);
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
    filteredParts: filteredPecas,
    suppliers,
    filters,
    setSupplierFilter,
    setPriceMin,
    setPriceMax,
    resetFilters,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    form,
    isSubmitting,
    handleAdd,
    handleEdit,
    onSubmit,
    editingPart: editingPeca,
  };
}
