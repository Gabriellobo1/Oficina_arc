import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, UserCog } from "lucide-react";
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
import type { Order, ServiceItem, Employee } from "@/types/models";

const MOCK_EMPLOYEES: Employee[] = [
  { id: "e1", name: "Marcos Mecânico", role: "Mecânico Sênior", averageRating: 4.8 },
  { id: "e2", name: "João Eletricista", role: "Eletricista Auto", averageRating: 4.5 },
];

interface ServicesTabProps {
  order: Order;
}

export function ServicesTab({ order }: ServicesTabProps) {
  const form = useForm<ServiceItemFormValues>({
    resolver: zodResolver(serviceItemSchema) as any,
    defaultValues: {
      serviceName: "",
      price: 0,
      employeeId: "",
    },
  });

  function onSubmit(values: ServiceItemFormValues) {
    console.log("Serviço adicionado", values);
    form.reset();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card rounded-xl p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Adicionar Serviço</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 md:flex-row md:items-end">
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Descrição do Serviço</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Alinhamento e Balanceamento" {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um funcionário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_EMPLOYEES.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          <div className="flex items-center gap-2">
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                            {emp.name}
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

            <Button type="submit" className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </form>
        </Form>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Serviço Executado</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[80px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.services.map((svc) => {
              const emp = MOCK_EMPLOYEES.find(e => e.id === svc.employeeId);
              return (
                <TableRow key={svc.id}>
                  <TableCell className="font-medium">{svc.serviceName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2 text-sm">
                      <UserCog className="h-3 w-3" />
                      {emp?.name || "Desconhecido"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(svc.price)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {order.services.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
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
