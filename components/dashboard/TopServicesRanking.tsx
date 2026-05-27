import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ServiceRankingItem } from "@/types/dashboard";

interface TopServicesRankingProps {
  data: ServiceRankingItem[];
}

const rankColors: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-slate-400",
  3: "text-amber-600",
};

export function TopServicesRanking({ data }: TopServicesRankingProps) {
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-yellow-500" />
        <div>
          <h2 className="text-sm font-semibold text-foreground">Top Serviços</h2>
          <p className="text-xs text-muted-foreground">Mais executados no mês</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors duration-150"
          >
            <span
              className={`w-5 text-center text-sm font-bold ${rankColors[item.rank] ?? "text-muted-foreground"}`}
            >
              {item.rank}
            </span>

            <div className="flex flex-1 flex-col min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.serviceName}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.count} execuções
              </p>
            </div>

            <Badge variant="secondary" className="shrink-0 text-xs">
              {item.totalRevenue}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
