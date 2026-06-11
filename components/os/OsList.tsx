"use client";

import { useState } from "react";
import { Car, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  useOrders,
  STATUS_LABEL,
  type OrdemAPI,
  type StatusBackend,
} from "@/hooks/use-orders";
import { OsDetailDialog } from "./OsDetailDialog";
import { NovaOsDialog } from "./NovaOsDialog";

const STATUS_STYLE: Record<StatusBackend, string> = {
  AGENDADO: "border-blue-500/30 bg-blue-500/10 text-blue-500",
  EM_ANDAMENTO: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  CONCLUIDO: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
  CANCELADO: "border-red-500/30 bg-red-500/10 text-red-500",
  NO_SHOW: "border-orange-500/30 bg-orange-500/10 text-orange-400",
};

const STATUS_ORDER: StatusBackend[] = [
  "AGENDADO",
  "EM_ANDAMENTO",
  "CONCLUIDO",
  "CANCELADO",
  "NO_SHOW",
];

export function OsList() {
  const { orders, meta, isLoading, statusFilter, setStatusFilter, refetch } = useOrders();
  const [selected, setSelected] = useState<OrdemAPI | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select
          value={statusFilter || "all"}
          onValueChange={(v) => setStatusFilter(v === "all" ? "" : (v as StatusBackend))}
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <NovaOsDialog onCreated={refetch} />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>OS</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Itens</TableHead>
              <TableHead className="hidden md:table-cell">Abertura</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  Nenhuma ordem de serviço encontrada.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="group cursor-pointer"
                  onClick={() => setSelected(order)}
                >
                  <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                    {order.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Car className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{order.veiculo.modelo}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {order.veiculo.placa}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_STYLE[order.status]}>
                      {STATUS_LABEL[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {order._count.itensServico + order._count.itensPeca} item(s)
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(order.aberturaEm).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        {meta.total} ordem{meta.total !== 1 ? "ns" : ""} de serviço.
      </p>

      <OsDetailDialog
        order={selected}
        onClose={() => setSelected(null)}
        onUpdated={refetch}
      />
    </div>
  );
}
