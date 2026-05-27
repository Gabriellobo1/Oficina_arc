import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KpiData } from "@/types/dashboard";
import {
  TrendingUp as TrendingUpIcon,
  Wrench,
  Users,
  Receipt,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  TrendingUp: TrendingUpIcon,
  Wrench,
  Users,
  Receipt,
};

interface KpiCardProps {
  data: KpiData;
}

export function KpiCard({ data }: KpiCardProps) {
  const Icon = iconMap[data.icon] ?? TrendingUpIcon;

  const ChangeIcon =
    data.changeType === "positive"
      ? TrendingUp
      : data.changeType === "negative"
      ? TrendingDown
      : Minus;

  return (
    <div className="kpi-gradient glass-card rounded-xl p-5 flex flex-col gap-4 hover:shadow-lg hover:shadow-blue-500/5 transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {data.label}
          </p>
          <p className="text-2xl font-700 text-foreground tracking-tight">
            {data.value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
          <Icon className="h-5 w-5 text-blue-500" />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <ChangeIcon
          className={cn(
            "h-3.5 w-3.5",
            data.changeType === "positive" && "text-emerald-500",
            data.changeType === "negative" && "text-red-500",
            data.changeType === "neutral" && "text-muted-foreground"
          )}
        />
        <span
          className={cn(
            "text-xs font-medium",
            data.changeType === "positive" && "text-emerald-500",
            data.changeType === "negative" && "text-red-500",
            data.changeType === "neutral" && "text-muted-foreground"
          )}
        >
          {data.change}
        </span>
        <span className="text-xs text-muted-foreground">vs. mês anterior</span>
      </div>
    </div>
  );
}
