"use client";

import { useRouter } from "next/navigation";
import { Plus, Clock, AlertCircle, CheckCircle2, Car, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useOrders } from "@/hooks/use-orders";
import type { Order, OrderStatus } from "@/types/models";

const COLUMNS: { id: OrderStatus; label: string; color: string }[] = [
  { id: "Aberta", label: "Abertas", color: "border-blue-500/30 bg-blue-500/10 text-blue-500" },
  { id: "Em Andamento", label: "Em Andamento", color: "border-amber-500/30 bg-amber-500/10 text-amber-500" },
  { id: "Aguardando Peça", label: "Aguardando Peças", color: "border-purple-500/30 bg-purple-500/10 text-purple-500" },
  { id: "Concluída", label: "Concluídas", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" },
];

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="glass-card group relative flex cursor-pointer flex-col gap-3 rounded-lg p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/50"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-muted-foreground">
          {order.id}
        </span>
        <span className="text-xs font-semibold text-foreground">
          {formatCurrency(order.total)}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="truncate">{order.clientName}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Car className="h-3.5 w-3.5" />
          <span className="truncate">{order.vehicle}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span>
        </div>
        {order.status === "Aguardando Peça" && (
          <AlertCircle className="h-4 w-4 text-purple-500" />
        )}
        {order.status === "Concluída" && (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        )}
      </div>
    </div>
  );
}

export function OsKanbanBoard() {
  const router = useRouter();
  const { orders } = useOrders();

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Ordens de Serviço
          </h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe o fluxo de veículos na oficina.
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nova OS
        </Button>
      </div>

      <div className="grid h-full grid-cols-1 gap-6 overflow-x-auto pb-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.id);
          return (
            <div key={col.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`px-2 py-1 ${col.color}`}>
                  {col.label}
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground">
                  {colOrders.length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3 rounded-xl bg-muted/20 p-3 min-h-[500px]">
                {colOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClick={() => router.push(`/ordens-de-servico/${order.id}`)}
                  />
                ))}
                {colOrders.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground opacity-50">
                    <span className="text-sm">Nenhuma OS</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
