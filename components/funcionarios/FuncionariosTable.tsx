"use client";

import { Star, Wrench, Badge as BadgeIcon, MoreHorizontal, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import type { Funcionario } from "@/types/funcionario";

interface FuncionariosTableProps {
  funcionarios: Funcionario[];
  onEdit: (funcionario: Funcionario) => void;
}

function RatingStars({ nota }: { nota?: number }) {
  if (!nota) return <span className="text-xs text-muted-foreground">Sem avaliações</span>;
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="text-sm font-medium">{nota.toFixed(1)}</span>
    </div>
  );
}

export function FuncionariosTable({ funcionarios, onEdit }: FuncionariosTableProps) {
  if (funcionarios.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-3 rounded-xl py-16 text-center">
        <BadgeIcon className="h-10 w-10 text-muted-foreground opacity-40" />
        <p className="text-sm text-muted-foreground">Nenhum funcionário encontrado.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead className="hidden md:table-cell">E-mail</TableHead>
            <TableHead className="hidden lg:table-cell">Salário</TableHead>
            <TableHead className="hidden lg:table-cell">Nota Média</TableHead>
            <TableHead className="hidden xl:table-cell">OS Atendidas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {funcionarios.map((f) => (
            <TableRow key={f.id} className="hover:bg-muted/20 transition-colors">
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{f.nome}</span>
                  {f.especialidade && (
                    <span className="text-xs text-muted-foreground">{f.especialidade}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">{f.cargo}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {f.email}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm font-mono">
                {formatCurrency(f.salario)}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <RatingStars nota={f.notaMedia} />
              </TableCell>
              <TableCell className="hidden xl:table-cell text-sm">
                {f.totalOs ?? 0}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    f.ativo
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                      : "border-muted-foreground/30 bg-muted/20 text-muted-foreground"
                  }
                >
                  {f.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    id={`func-menu-${f.id}`}
                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Ações</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(f)} className="gap-2">
                      <Pencil className="h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
