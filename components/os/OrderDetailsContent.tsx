"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Wrench, PackageSearch } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderHeader } from "./OrderHeader";
import { ServicesTab } from "./tabs/ServicesTab";
import { PartsTab } from "./tabs/PartsTab";
import { PaymentCheckoutDialog } from "./PaymentCheckoutDialog";
import { useOrders } from "@/hooks/use-orders";
import type { PaymentFormValues } from "@/schema/schemaOrder";

interface OrderDetailsContentProps {
  orderId: string;
}

export function OrderDetailsContent({ orderId }: OrderDetailsContentProps) {
  const { getOrderById, updateOrderStatus } = useOrders();
  const order = getOrderById(orderId);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Ordem de serviço não encontrada.</p>
      </div>
    );
  }

  async function handleConfirmPayment(values: PaymentFormValues) {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      updateOrderStatus(order!.id, "Concluída");
      toast.success("Ordem de serviço finalizada e pagamento registrado!");
      setIsPaymentModalOpen(false);
    } catch {
      toast.error("Erro ao registrar pagamento.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <OrderHeader 
        order={order} 
        onFinishOrder={() => setIsPaymentModalOpen(true)} 
      />

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
    </div>
  );
}
