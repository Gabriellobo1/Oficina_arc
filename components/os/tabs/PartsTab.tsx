import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, PackageSearch } from "lucide-react";
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
import type { Order, Part } from "@/types/models";

const MOCK_STOCK: Part[] = [
  { id: "p1", name: "Óleo do Motor 5W30", sku: "OL-5W30", currentQty: 25, minQty: 10, price: 45.0 },
  { id: "p2", name: "Filtro de Óleo", sku: "FL-OL-01", currentQty: 8, minQty: 15, price: 25.0 },
];

interface PartsTabProps {
  order: Order;
}

export function PartsTab({ order }: PartsTabProps) {
  const form = useForm<PartConsumptionFormValues>({
    resolver: zodResolver(partConsumptionSchema) as Resolver<PartConsumptionFormValues>,
    defaultValues: {
      partId: "",
      quantity: 1,
    },
  });

  function onSubmit(values: PartConsumptionFormValues) {
    console.log("Peça consumida", values);
    form.reset();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card rounded-xl p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Consumir Peça</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 md:flex-row md:items-end">
            <FormField
              control={form.control}
              name="partId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Buscar Peça no Estoque</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a peça" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_STOCK.map((part) => (
                        <SelectItem key={part.id} value={part.id} disabled={part.currentQty === 0}>
                          <div className="flex items-center gap-2">
                            <PackageSearch className="h-4 w-4 text-muted-foreground" />
                            <span>{part.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              (Disp: {part.currentQty}) - {formatCurrency(part.price)}
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
              <TableHead>Peça</TableHead>
              <TableHead className="text-right">Qtd.</TableHead>
              <TableHead className="text-right">Valor Unit.</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[80px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.parts.map((pc) => {
              const partData = MOCK_STOCK.find(p => p.id === pc.partId);
              return (
                <TableRow key={pc.id}>
                  <TableCell className="font-medium">{partData?.name || "Desconhecida"}</TableCell>
                  <TableCell className="text-right">{pc.quantity}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(pc.unitPrice)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(pc.quantity * pc.unitPrice)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {order.parts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
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
