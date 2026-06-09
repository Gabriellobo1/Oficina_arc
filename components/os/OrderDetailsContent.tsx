"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Wrench, PackageSearch, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderHeader } from "./OrderHeader";
import { ServicesTab } from "./tabs/ServicesTab";
import { PartsTab } from "./tabs/PartsTab";
import { PaymentCheckoutDialog } from "./PaymentCheckoutDialog";
import { AvaliacaoDialog } from "./AvaliacaoDialog";
import { useOrderDetail } from "@/hooks/use-order-detail";
import { useOrders } from "@/hooks/use-orders";
import type { PaymentFormValues } from "@/schema/schemaOrder";

interface OrderDetailsContentProps {
  orderId: string;
}

export function OrderDetailsContent({ orderId }: OrderDetailsContentProps) {
  const { order, isLoading, error, registrarPagamento, adicionarItemServico, adicionarItemPeca, refetch } =
    useOrderDetail(orderId);
  const { updateOrderStatus } = useOrders();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAvaliacaoOpen, setIsAvaliacaoOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">{error ?? "Ordem de serviço não encontrada."}</p>
      </div>
    );
  }

  async function handleConfirmPayment(values: PaymentFormValues) {
    setIsSubmitting(true);
    try {
      // 1. Muda status para CONCLUIDO com o km de saída
      await updateOrderStatus(orderId, "CONCLUIDO", values.km_saida);
      // 2. Registra o pagamento (backend exige status CONCLUIDO)
      await registrarPagamento({
        valor_total: totalOS,
        forma_pagamento: values.method,
        parcelas: values.installments ?? 1,
      });
      toast.success("OS finalizada e pagamento registrado!");
      setIsPaymentModalOpen(false);
      refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao finalizar OS.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isConcluido = order.status === "CONCLUIDO";
  const jaAvaliado = !!order.avaliacao;

  const totalOS =
    order.itensServico.reduce(
      (acc, i) => acc + i.quantidade * i.preco_unitario - i.desconto,
      0
    ) +
    order.itensPeca.reduce(
      (acc, i) => acc + i.quantidade * i.preco_unitario - i.desconto,
      0
    );

  return (
    <div className="flex flex-col gap-6">
      <OrderHeader
        order={order}
        total={totalOS}
        onFinishOrder={() => setIsPaymentModalOpen(true)}
      />

      {isConcluido && (
        <div className="glass-card flex items-center justify-between rounded-lg px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              {jaAvaliado ? "Avaliação registrada" : "Avalie este atendimento"}
            </span>
            {jaAvaliado ? (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= (order.avaliacao?.nota ?? 0) ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground"}`}
                  />
                ))}
                {order.avaliacao?.comentario && (
                  <span className="ml-2 text-xs text-muted-foreground truncate max-w-xs">
                    "{order.avaliacao.comentario}"
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">
                Ajude-nos a melhorar — leva menos de 1 minuto.
              </span>
            )}
          </div>
          {!jaAvaliado && (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
              onClick={() => setIsAvaliacaoOpen(true)}
            >
              <Star className="h-4 w-4" />
              Avaliar
            </Button>
          )}
        </div>
      )}

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Serviços
          </TabsTrigger>
          <TabsTrigger value="parts" className="flex items-center gap-2">
            <PackageSearch className="h-4 w-4" />
            Peças Consumidas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-0 outline-none">
          <ServicesTab
            orderId={orderId}
            itensServico={order.itensServico}
            isClosed={isConcluido || order.status === "CANCELADO"}
            onAdded={refetch}
          />
        </TabsContent>

        <TabsContent value="parts" className="mt-0 outline-none">
          <PartsTab
            orderId={orderId}
            itensPeca={order.itensPeca}
            isClosed={isConcluido || order.status === "CANCELADO"}
            onAdded={refetch}
          />
        </TabsContent>
      </Tabs>

      <PaymentCheckoutDialog
        order={order}
        total={totalOS}
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onConfirm={handleConfirmPayment}
        isSubmitting={isSubmitting}
      />

      <AvaliacaoDialog
        orderId={order.id}
        open={isAvaliacaoOpen}
        onOpenChange={setIsAvaliacaoOpen}
        onSuccess={() => {
          refetch();
          toast.success("Obrigado pela avaliação!");
        }}
      />
    </div>
  );
}
