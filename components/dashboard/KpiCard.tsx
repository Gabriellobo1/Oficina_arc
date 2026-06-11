import { TrendingUp, TrendingDown, Minus, LucideIcon, Wrench, Users, Receipt, DollarSign, Package, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KpiData } from "@/types/dashboard";

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Wrench,
  Users,
  Receipt,
  DollarSign,
  Package,
  Star,
};

const colorMap: Record<string, string> = {
  Users: "text-blue-500 bg-blue-500/10 ring-blue-500/20",
  Wrench: "text-indigo-500 bg-indigo-500/10 ring-indigo-500/20",
  TrendingUp: "text-emerald-500 bg-emerald-500/10 ring-emerald-500/20",
  DollarSign: "text-emerald-500 bg-emerald-500/10 ring-emerald-500/20",
  Receipt: "text-violet-500 bg-violet-500/10 ring-violet-500/20",
  Star: "text-amber-500 bg-amber-500/10 ring-amber-500/20",
  Package: "text-orange-500 bg-orange-500/10 ring-orange-500/20",
};

interface KpiCardProps {
  data: KpiData;
}

export function KpiCard({ data }: KpiCardProps) {
  const Icon = iconMap[data.icon] ?? TrendingUp;
  const colorClasses = colorMap[data.icon] ?? colorMap.TrendingUp;

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
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {data.value}
          </p>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg ring-1", colorClasses)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <ChangeIcon
          className={cn(
            "h-3.5 w-3.5 shrink-0",
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
      </div>
    </div>
  );
}
