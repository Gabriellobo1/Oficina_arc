import { Car, Clock, User, CheckCircle2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types/models";

interface OrderHeaderProps {
  order: Order;
  onFinishOrder: () => void;
}

export function OrderHeader({ order, onFinishOrder }: OrderHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        className="w-fit text-muted-foreground hover:text-foreground -ml-4"
        onClick={() => router.push("/ordens-de-servico")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar para Kanban
      </Button>

      <div className="glass-card flex flex-col gap-4 rounded-xl p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {order.id}
            </h2>
            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
              {order.status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{order.clientName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Car className="h-4 w-4" />
              <span>{order.vehicle}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex flex-col gap-1 md:text-right">
            <span className="text-sm font-medium text-muted-foreground">Total da OS</span>
            <span className="text-3xl font-bold text-foreground">
              {formatCurrency(order.total)}
            </span>
          </div>

          {order.status !== "Concluído" && order.status !== "Cancelado" && order.status !== "No-show" && (
            <Button onClick={onFinishOrder} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Finalizar OS
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass-card flex flex-col gap-1 rounded-lg p-4">
          <span className="text-xs text-muted-foreground">Odômetro Entrada</span>
          <span className="font-mono text-sm font-medium text-foreground">
            {order.odometerIn ? `${order.odometerIn} km` : "N/I"}
          </span>
        </div>
        <div className="glass-card flex flex-col gap-1 rounded-lg p-4">
          <span className="text-xs text-muted-foreground">Odômetro Saída</span>
          <span className="font-mono text-sm font-medium text-foreground">
            {order.odometerOut ? `${order.odometerOut} km` : "Em andamento"}
          </span>
        </div>
        <div className="glass-card flex flex-col gap-1 rounded-lg p-4">
          <span className="text-xs text-muted-foreground">Qtd. Serviços</span>
          <span className="text-sm font-medium text-foreground">
            {order.services.length}
          </span>
        </div>
        <div className="glass-card flex flex-col gap-1 rounded-lg p-4">
          <span className="text-xs text-muted-foreground">Qtd. Peças</span>
          <span className="text-sm font-medium text-foreground">
            {order.parts.reduce((acc, curr) => acc + curr.quantity, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
