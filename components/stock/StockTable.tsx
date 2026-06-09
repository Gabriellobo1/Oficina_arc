import { Edit2, Package, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { PecaAPI } from "@/hooks/use-stock";

interface StockTableProps {
  parts: PecaAPI[];
  onEdit: (part: PecaAPI) => void;
}

export function StockTable({ parts, onEdit }: StockTableProps) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-muted/30">
            <TableHead className="w-[80px]">Status</TableHead>
            <TableHead>Peça</TableHead>
            <TableHead className="hidden md:table-cell">Código</TableHead>
            <TableHead className="hidden lg:table-cell">Fornecedor</TableHead>
            <TableHead className="text-right">Estoque Atual</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Estoque Mín.</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="w-[80px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parts.map((part) => {
            const isCritical = part.quantidade === 0;
            const isLow = !isCritical && part.quantidade <= part.quantidade_minima;

            return (
              <TableRow
                key={part.id}
                className={cn(
                  "border-border transition-colors duration-150",
                  isCritical && "bg-destructive/5 hover:bg-destructive/10",
                  isLow && "bg-amber-500/5 hover:bg-amber-500/10",
                  !isCritical && !isLow && "hover:bg-muted/30"
                )}
              >
                <TableCell>
                  {isCritical ? (
                    <Badge variant="destructive" className="flex w-fit items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Falta
                    </Badge>
                  ) : isLow ? (
                    <Badge
                      variant="secondary"
                      className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 flex w-fit items-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Baixo
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 flex w-fit items-center gap-1"
                    >
                      <Package className="h-3 w-3" />
                      OK
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium text-foreground">{part.nome}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground hidden md:table-cell">
                  {part.id.slice(0, 8).toUpperCase()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                  {part.fornecedor ?? "—"}
                </TableCell>
                <TableCell className="text-right font-medium">
                  <span className={isCritical || isLow ? "text-destructive" : "text-foreground"}>
                    {part.quantidade}
                  </span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
                  {part.quantidade_minima}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatCurrency(Number(part.preco_unitario))}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(part)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}

          {parts.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                Nenhuma peça encontrada com os filtros aplicados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
