"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { partConsumptionSchema, type PartConsumptionFormValues } from "@/schema/schemaOrder";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";
import type { ItemPecaAPI } from "@/hooks/use-order-detail";

interface PecaAPI {
  id: string;
  nome: string;
  preco_unitario: number;
  quantidade: number;
}

interface PartsTabProps {
  orderId: string;
  itensPeca: ItemPecaAPI[];
  isClosed: boolean;
  onAdded: () => void;
}

export function PartsTab({ orderId, itensPeca, isClosed, onAdded }: PartsTabProps) {
  const { getToken } = useAuth();
  const [pecas, setPecas] = useState<PecaAPI[]>([]);

  useEffect(() => {
    api
      .get<PecaAPI[]>(API_ENDPOINTS.pecas.list, { token: getToken() })
      .then(setPecas)
      .catch(() => toast.error("Erro ao carregar estoque."));
  }, [getToken]);

  const form = useForm<PartConsumptionFormValues>({
    resolver: zodResolver(partConsumptionSchema) as any,
    defaultValues: { partId: "", quantity: 1 },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: PartConsumptionFormValues) {
    const peca = pecas.find((p) => p.id === values.partId);
    if (!peca) return;

    try {
      await api.post(
        API_ENDPOINTS.agendamentos.addPeca(orderId),
        {
          pecaId: values.partId,
          quantidade: values.quantity,
          preco_unitario: peca.preco_unitario,
        },
        { token: getToken() }
      );
      toast.success("Peça adicionada!");
      form.reset();
      onAdded();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao adicionar peça.";
      toast.error(message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {!isClosed && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Consumir Peça</h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 md:flex-row md:items-end"
            >
              <FormField
                control={form.control}
                name="partId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Buscar Peça no Estoque</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a peça" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pecas.map((p) => (
                          <SelectItem key={p.id} value={p.id} disabled={p.quantidade === 0}>
                            <div className="flex items-center gap-2">
                              <PackageSearch className="h-4 w-4 text-muted-foreground" />
                              <span>{p.nome}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                (Disp: {p.quantidade}) — {formatCurrency(Number(p.preco_unitario))}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="w-full md:w-[120px]">
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </form>
          </Form>
        </div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Peça</TableHead>
              <TableHead className="text-right">Qtd.</TableHead>
              <TableHead className="text-right">Valor Unit.</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itensPeca.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.peca.nome}</TableCell>
                <TableCell className="text-right">{item.quantidade}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatCurrency(item.preco_unitario)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.quantidade * item.preco_unitario - item.desconto)}
                </TableCell>
              </TableRow>
            ))}
            {itensPeca.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Nenhuma peça consumida nesta OS.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
