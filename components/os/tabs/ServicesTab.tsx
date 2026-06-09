"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, UserCog } from "lucide-react";
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
import { serviceItemSchema, type ServiceItemFormValues } from "@/schema/schemaOrder";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";
import type { ItemServicoAPI } from "@/hooks/use-order-detail";

interface TipoServicoAPI {
  id: string;
  nome: string;
  preco_base: number;
}

interface FuncionarioAPI {
  id: string;
  nome: string;
  cargo: string;
}

interface ServicesTabProps {
  orderId: string;
  itensServico: ItemServicoAPI[];
  isClosed: boolean;
  onAdded: () => void;
}

export function ServicesTab({ orderId, itensServico, isClosed, onAdded }: ServicesTabProps) {
  const { getToken } = useAuth();
  const [tiposServico, setTiposServico] = useState<TipoServicoAPI[]>([]);
  const [funcionarios, setFuncionarios] = useState<FuncionarioAPI[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<TipoServicoAPI[]>(API_ENDPOINTS.tipoServico.list, { token: getToken() }),
      api.get<FuncionarioAPI[]>(API_ENDPOINTS.funcionarios.list, { token: getToken() }),
    ])
      .then(([tipos, funcs]) => {
        setTiposServico(tipos);
        setFuncionarios(funcs);
      })
      .catch(() => toast.error("Erro ao carregar dados de serviço."));
  }, [getToken]);

  const form = useForm<ServiceItemFormValues>({
    resolver: zodResolver(serviceItemSchema) as any,
    defaultValues: {
      serviceName: "",
      price: 0,
      employeeId: "",
    },
  });

  const { isSubmitting } = form.formState;

  function handleTipoChange(tipoId: string) {
    const tipo = tiposServico.find((t) => t.id === tipoId);
    if (tipo) {
      form.setValue("serviceName", tipoId);
      form.setValue("price", Number(tipo.preco_base));
    }
  }

  async function onSubmit(values: ServiceItemFormValues) {
    try {
      await api.post(
        API_ENDPOINTS.agendamentos.addServico(orderId),
        {
          tipoServicoId: values.serviceName,
          funcionarioId: values.employeeId,
          quantidade: 1,
          preco_unitario: values.price,
        },
        { token: getToken() }
      );
      toast.success("Serviço adicionado!");
      form.reset();
      onAdded();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao adicionar serviço.";
      toast.error(message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {!isClosed && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Adicionar Serviço</h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 md:flex-row md:items-end"
            >
              <FormField
                control={form.control}
                name="serviceName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tipo de Serviço</FormLabel>
                    <Select
                      onValueChange={(val) => { field.onChange(val); handleTipoChange(val); }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o serviço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposServico.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.nome} — {formatCurrency(Number(t.preco_base))}
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
                name="employeeId"
                render={({ field }) => (
                  <FormItem className="w-full md:w-[250px]">
                    <FormLabel>Funcionário Responsável</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um funcionário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {funcionarios.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            <div className="flex items-center gap-2">
                              <UserCog className="h-4 w-4 text-muted-foreground" />
                              {f.nome} — {f.cargo}
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
                name="price"
                render={({ field }) => (
                  <FormItem className="w-full md:w-[150px]">
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
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
              <TableHead>Serviço Executado</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="text-right">Qtd.</TableHead>
              <TableHead className="text-right">Valor Unit.</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itensServico.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.tipoServico.nome}</TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2 text-sm">
                    <UserCog className="h-3 w-3" />
                    {item.funcionario.nome}
                  </div>
                </TableCell>
                <TableCell className="text-right">{item.quantidade}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatCurrency(item.preco_unitario)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.quantidade * item.preco_unitario - item.desconto)}
                </TableCell>
              </TableRow>
            ))}
            {itensServico.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Nenhum serviço registrado nesta OS.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
