import { KpiCard } from "./KpiCard";
import type { KpiData } from "@/types/dashboard";

interface KpiCardsGridProps {
  data: KpiData[];
}

export function KpiCardsGrid({ data }: KpiCardsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.map((kpi) => (
        <KpiCard key={kpi.label} data={kpi} />
      ))}
    </div>
  );
}
