"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Wrench, PackageSearch, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { OrderHeader } from "./OrderHeader";
import { ServicesTab } from "./tabs/ServicesTab";
import { PartsTab } from "./tabs/PartsTab";
import { PaymentCheckoutDialog } from "./PaymentCheckoutDialog";
import { AvaliacaoDialog } from "./AvaliacaoDialog";
import { useOrders } from "@/hooks/use-orders";
import type { PaymentFormValues } from "@/schema/schemaOrder";

interface OrderDetailsContentProps {
  orderId: string;
}

export function OrderDetailsContent({ orderId }: OrderDetailsContentProps) {
  const { getOrderById, updateOrderStatus } = useOrders();
  const order = getOrderById(orderId);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAvaliacaoOpen, setIsAvaliacaoOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Ordem de serviço não encontrada.</p>
      </div>
    );
  }

  async function handleConfirmPayment(values: PaymentFormValues) {
    if (!order) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      updateOrderStatus(order.id, "Concluída");
      toast.success("Ordem de serviço finalizada e pagamento registrado!");
      setIsPaymentModalOpen(false);
    } catch {
      toast.error("Erro ao registrar pagamento.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isConcluido = order.status === "Concluída";
  const jaAvaliado = !!order.rating;

  return (
    <div className="flex flex-col gap-6">
      <OrderHeader
        order={order}
        onFinishOrder={() => setIsPaymentModalOpen(true)}
      />

      {/* Botão de avaliação — visível apenas para OS Concluídas e sem avaliação prévia */}
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
                    className={`h-4 w-4 ${s <= (order.rating ?? 0) ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground"}`}
                  />
                ))}
                {order.ratingComment && (
                  <span className="ml-2 text-xs text-muted-foreground truncate max-w-xs">
                    "{order.ratingComment}"
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
              id="btn-avaliar-os"
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
          <ServicesTab order={order} />
        </TabsContent>

        <TabsContent value="parts" className="mt-0 outline-none">
          <PartsTab order={order} />
        </TabsContent>
      </Tabs>

      <PaymentCheckoutDialog
        order={order}
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onConfirm={handleConfirmPayment}
        isSubmitting={isSubmitting}
      />

      <AvaliacaoDialog
        orderId={order.id}
        open={isAvaliacaoOpen}
        onOpenChange={setIsAvaliacaoOpen}
        onSuccess={(nota, comentario) => {
          // Atualiza localmente o mock; no futuro virá da API
          toast.success("Obrigado pela avaliação!");
        }}
      />
    </div>
  );
}
