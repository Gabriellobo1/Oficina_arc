"use client";

import { useState, useEffect } from "react";
import { Car, User, Gauge, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";
import {
  STATUS_LABEL,
  type OrdemAPI,
  type StatusBackend,
} from "@/hooks/use-orders";

const STATUS_OPTIONS: StatusBackend[] = [
  "AGENDADO",
  "EM_ANDAMENTO",
  "CONCLUIDO",
  "CANCELADO",
  "NO_SHOW",
];

interface OrdemDetalhe extends OrdemAPI {
  km_saida?: number;
  observacoes?: string;
  veiculo: OrdemAPI["veiculo"] & {
    marca?: string;
    cliente?: { nome: string };
  };
  itensServico?: unknown[];
  itensPeca?: unknown[];
  pagamento?: { valor_total: number; status: string; forma_pagamento: string } | null;
}

interface OsDetailDialogProps {
  order: OrdemAPI | null;
  onClose: () => void;
  onUpdated: () => void;
}

export function OsDetailDialog({ order, onClose, onUpdated }: OsDetailDialogProps) {
  const { getToken } = useAuth();
  const [detalhe, setDetalhe] = useState<OrdemDetalhe | null>(null);
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);
  const [novoStatus, setNovoStatus] = useState<StatusBackend>("AGENDADO");
  const [kmSaida, setKmSaida] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!order) return;
    setNovoStatus(order.status);
    setKmSaida("");
    setDetalhe(null);
    setLoadingDetalhe(true);

    api
      .get<OrdemDetalhe>(API_ENDPOINTS.agendamentos.getById(order.id), {
        token: getToken(),
      })
      .then(setDetalhe)
      .catch(() => {
        /* mantém os dados da lista; modal continua usável */
      })
      .finally(() => setLoadingDetalhe(false));
  }, [order, getToken]);

  if (!order) return null;

  const data = detalhe ?? order;
  const concluindo = novoStatus === "CONCLUIDO";
  const kmEntrada = (data as OrdemDetalhe).km_entrada ?? order.km_entrada;

  async function handleSave() {
    if (!order) return;
    if (concluindo) {
      const km = Number(kmSaida);
      if (!kmSaida || Number.isNaN(km)) {
        toast.error("Informe o km de saída para concluir a OS.");
        return;
      }
      if (km < kmEntrada) {
        toast.error("Km de saída não pode ser menor que o km de entrada.");
        return;
      }
    }

    setSaving(true);
    try {
      await api.patch(
        API_ENDPOINTS.agendamentos.updateStatus(order.id),
        {
          status: novoStatus,
          ...(concluindo ? { km_saida: Number(kmSaida) } : {}),
        },
        { token: getToken() }
      );
      toast.success("Status atualizado com sucesso!");
      onUpdated();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar o status.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  const clienteNome = (data as OrdemDetalhe).veiculo?.cliente?.nome;
  const marca = (data as OrdemDetalhe).veiculo?.marca;

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Ordem de Serviço
            <span className="font-mono text-sm text-muted-foreground">
              {order.id.slice(0, 8).toUpperCase()}
            </span>
          </DialogTitle>
          <DialogDescription>Detalhes da OS e alteração de status.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {marca ? `${marca} ` : ""}
                {order.veiculo.modelo}{" "}
                <span className="font-mono text-xs text-muted-foreground">
                  {order.veiculo.placa}
                </span>
              </span>
            </div>
            {clienteNome && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{clienteNome}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Entrada: {kmEntrada.toLocaleString("pt-BR")} km
                {(data as OrdemDetalhe).km_saida
                  ? ` · Saída: ${(data as OrdemDetalhe).km_saida!.toLocaleString("pt-BR")} km`
                  : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {new Date(order.aberturaEm).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {order._count.itensServico} serviço(s) · {order._count.itensPeca} peça(s)
            </span>
            {(data as OrdemDetalhe).pagamento && (
              <Badge variant="outline">
                Pagamento: {(data as OrdemDetalhe).pagamento!.status}
              </Badge>
            )}
            {loadingDetalhe && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          </div>

          {(data as OrdemDetalhe).observacoes && (
            <p className="rounded-md bg-muted/30 px-3 py-2 text-sm">
              {(data as OrdemDetalhe).observacoes}
            </p>
          )}

          <Separator />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Status da OS</label>
            <Select
              value={novoStatus}
              onValueChange={(v) => setNovoStatus(v as StatusBackend)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {concluindo && order.status !== "CONCLUIDO" && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Km de saída</label>
                <Input
                  type="number"
                  placeholder={`>= ${kmEntrada}`}
                  value={kmSaida}
                  onChange={(e) => setKmSaida(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || novoStatus === order.status}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
