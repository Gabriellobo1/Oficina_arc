import { AlertTriangle } from "lucide-react";
import type { StockAlert } from "@/types/dashboard";

interface StockAlertListProps {
  data: StockAlert[];
}

function StockLevelBar({ current, min }: { current: number; min: number }) {
  const percentage = Math.min((current / min) * 100, 100);
  const colorClass =
    percentage <= 25
      ? "bg-red-500"
      : percentage <= 50
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function StockAlertList({ data }: StockAlertListProps) {
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <div>
          <h2 className="text-sm font-semibold text-foreground">Alertas de Estoque</h2>
          <p className="text-xs text-muted-foreground">Peças abaixo do mínimo</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {data.map((alert) => (
          <div key={alert.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground truncate pr-4">
                {alert.partName}
              </p>
              <span className="text-xs font-mono text-muted-foreground shrink-0">
                {alert.currentQty}/{alert.minQty} {alert.unit}
              </span>
            </div>
            <StockLevelBar current={alert.currentQty} min={alert.minQty} />
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Estoque em dia ✓
        </p>
      )}
    </div>
  );
}
