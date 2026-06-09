import { Star, UserCog } from "lucide-react";

interface EmployeeRating {
  id: string;
  name: string;
  role: string;
  averageRating: number;
}

interface EmployeeRatingListProps {
  data: EmployeeRating[];
}

export function EmployeeRatingList({ data }: EmployeeRatingListProps) {
  // Sort by rating desc
  const sortedData = [...data].sort((a, b) => b.averageRating - a.averageRating);

  return (
    <div className="glass-card flex flex-col gap-4 rounded-xl p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Ranking de Avaliações</h3>
        <p className="text-sm text-muted-foreground">Nota média por funcionário</p>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {sortedData.map((emp, index) => (
          <div
            key={emp.id}
            className="flex items-center gap-4 rounded-lg bg-muted/20 p-3 transition-colors hover:bg-muted/40"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserCog className="h-5 w-5" />
            </div>

            <div className="flex flex-1 flex-col min-w-0">
              <span className="truncate text-sm font-medium text-foreground">
                {emp.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {emp.role}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-bold text-foreground">
                  {emp.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {index === 0 ? "Top 1" : `${index + 1}º Lugar`}
              </span>
            </div>
          </div>
        ))}

        {sortedData.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma avaliação registrada.
          </div>
        )}
      </div>
    </div>
  );
}
