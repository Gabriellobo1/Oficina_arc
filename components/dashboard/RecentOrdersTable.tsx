import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { OrderStatus, RecentOrder } from "@/types/dashboard";

interface RecentOrdersTableProps {
  data: RecentOrder[];
}

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  Aberta: {
    label: "Aberta",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  "Em Andamento": {
    label: "Em Andamento",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  Concluída: {
    label: "Concluída",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  Cancelada: {
    label: "Cancelada",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export function RecentOrdersTable({ data }: RecentOrdersTableProps) {
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Últimas Ordens de Serviço</h2>
        <p className="text-xs text-muted-foreground">Atividade recente da oficina</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-xs text-muted-foreground font-medium">OS</TableHead>
            <TableHead className="text-xs text-muted-foreground font-medium">Cliente</TableHead>
            <TableHead className="text-xs text-muted-foreground font-medium hidden md:table-cell">
              Veículo
            </TableHead>
            <TableHead className="text-xs text-muted-foreground font-medium">Status</TableHead>
            <TableHead className="text-xs text-muted-foreground font-medium text-right">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((order) => {
            const status = statusConfig[order.status];
            return (
              <TableRow
                key={order.id}
                className="border-border hover:bg-muted/30 transition-colors duration-150"
              >
                <TableCell className="text-xs font-mono font-medium text-muted-foreground">
                  {order.id}
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground">
                  {order.clientName}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                  {order.vehicle}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                      status.className
                    )}
                  >
                    {status.label}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-semibold text-foreground text-right">
                  {order.total}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
