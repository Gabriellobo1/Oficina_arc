"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CreditCard, Banknote, Landmark, Wallet, FileText, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { paymentSchema, type PaymentFormValues } from "@/schema/schemaOrder";
import { formatCurrency } from "@/lib/utils";
import type { OrdemDetalheAPI } from "@/hooks/use-order-detail";

interface PaymentCheckoutDialogProps {
  order: OrdemDetalheAPI;
  total: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (values: PaymentFormValues) => void;
  isSubmitting: boolean;
}

export function PaymentCheckoutDialog({
  order,
  total,
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: PaymentCheckoutDialogProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      method: "DINHEIRO",
      installments: 1,
      km_saida: order.km_entrada,
    },
  });

  const selectedMethod = form.watch("method");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Finalizar Ordem de Serviço</DialogTitle>
          <DialogDescription>
            Informe o odômetro de saída e a forma de pagamento para concluir a OS{" "}
            <strong className="text-foreground">{order.id.slice(0, 8).toUpperCase()}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4 border border-border">
            <span className="text-sm font-medium text-muted-foreground">Valor Total a Pagar</span>
            <span className="text-2xl font-bold text-foreground">{formatCurrency(total)}</span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onConfirm)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="km_saida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      Odômetro de Saída (km)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={order.km_entrada}
                        placeholder={`Mín. ${order.km_entrada} km`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CARTAO_CREDITO">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            Cartão de Crédito
                          </div>
                        </SelectItem>
                        <SelectItem value="CARTAO_DEBITO">
                          <div className="flex items-center gap-2">
                            <Landmark className="h-4 w-4 text-muted-foreground" />
                            Cartão de Débito
                          </div>
                        </SelectItem>
                        <SelectItem value="PIX">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                            PIX
                          </div>
                        </SelectItem>
                        <SelectItem value="DINHEIRO">
                          <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                            Dinheiro
                          </div>
                        </SelectItem>
                        <SelectItem value="BOLETO">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Boleto
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedMethod === "CARTAO_CREDITO" && (
                <FormField
                  control={form.control}
                  name="installments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parcelamento</FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        defaultValue={String(field.value ?? 1)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione as parcelas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                            <SelectItem key={num} value={String(num)}>
                              {num}x de {formatCurrency(total / num)}{" "}
                              {num === 1 ? "à vista" : "sem juros"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Confirmar Pagamento"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
