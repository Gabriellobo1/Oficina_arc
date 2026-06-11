"use client";

import { useState, useEffect, useMemo } from "react";
import { CreditCard, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency } from "@/lib/utils";

interface PagamentoAPI {
  id: string;
  valor_total: number;
  forma_pagamento: string;
  parcelas: number;
  status: string;
  criadoEm: string;
  veiculo_placa: string;
  veiculo_marca: string;
  veiculo_modelo: string;
  cliente_nome: string;
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PAGO: "default",
  PENDENTE: "secondary",
  CANCELADO: "destructive",
};

function formatForma(forma: string) {
  return forma
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function PagamentosContent() {
  const { getToken } = useAuth();
  const [pagamentos, setPagamentos] = useState<PagamentoAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<PagamentoAPI[]>(API_ENDPOINTS.pagamentos.list, { token: getToken() })
      .then(setPagamentos)
      .catch(() => toast.error("Erro ao carregar pagamentos."))
      .finally(() => setIsLoading(false));
  }, [getToken]);

  const totalRecebido = useMemo(
    () =>
      pagamentos
        .filter((p) => p.status === "PAGO")
        .reduce((acc, p) => acc + Number(p.valor_total), 0),
    [pagamentos]
  );

  const totalPendente = useMemo(
    () =>
      pagamentos
        .filter((p) => p.status === "PENDENTE")
        .reduce((acc, p) => acc + Number(p.valor_total), 0),
    [pagamentos]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Recebido</p>
              <p className="text-lg font-bold">{formatCurrency(totalRecebido)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <CreditCard className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pendente</p>
              <p className="text-lg font-bold">{formatCurrency(totalPendente)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Registros</p>
              <p className="text-lg font-bold">{pagamentos.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Forma</TableHead>
              <TableHead>Parcelas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : pagamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <CreditCard className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Nenhum pagamento registrado
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              pagamentos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.cliente_nome}</TableCell>
                  <TableCell>
                    {p.veiculo_marca} {p.veiculo_modelo}{" "}
                    <span className="font-mono text-xs text-muted-foreground">
                      {p.veiculo_placa}
                    </span>
                  </TableCell>
                  <TableCell>{formatForma(p.forma_pagamento)}</TableCell>
                  <TableCell>{p.parcelas}x</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[p.status] ?? "outline"}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(Number(p.valor_total))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
