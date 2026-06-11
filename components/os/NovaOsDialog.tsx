"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus } from "lucide-react";
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
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";

interface VeiculoOption {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  cliente_nome?: string;
}

interface NovaOsDialogProps {
  onCreated: () => void;
}

export function NovaOsDialog({ onCreated }: NovaOsDialogProps) {
  const { getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [veiculos, setVeiculos] = useState<VeiculoOption[]>([]);
  const [loadingVeiculos, setLoadingVeiculos] = useState(false);
  const [veiculoId, setVeiculoId] = useState("");
  const [kmEntrada, setKmEntrada] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setVeiculoId("");
    setKmEntrada("");
    setObservacoes("");
    setLoadingVeiculos(true);
    api
      .get<VeiculoOption[]>(API_ENDPOINTS.veiculos.list, { token: getToken() })
      .then(setVeiculos)
      .catch(() => toast.error("Erro ao carregar veículos."))
      .finally(() => setLoadingVeiculos(false));
  }, [open, getToken]);

  async function handleCreate() {
    if (!veiculoId) {
      toast.error("Selecione um veículo.");
      return;
    }
    const km = Number(kmEntrada);
    if (kmEntrada === "" || Number.isNaN(km) || km < 0) {
      toast.error("Informe um km de entrada válido.");
      return;
    }

    setSaving(true);
    try {
      await api.post(
        API_ENDPOINTS.agendamentos.create,
        { veiculoId, km_entrada: km, observacoes: observacoes || undefined },
        { token: getToken() }
      );
      toast.success("Ordem de serviço criada!");
      setOpen(false);
      onCreated();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar a OS.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button className="w-full sm:w-auto" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Nova OS
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Serviço</DialogTitle>
          <DialogDescription>
            Selecione o veículo e informe a quilometragem de entrada.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Veículo</label>
            <Select value={veiculoId} onValueChange={(v) => setVeiculoId(v ?? "")} disabled={loadingVeiculos}>
              <SelectTrigger>
                <SelectValue
                  placeholder={loadingVeiculos ? "Carregando..." : "Selecione o veículo"}
                />
              </SelectTrigger>
              <SelectContent>
                {veiculos.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.marca} {v.modelo} · {v.placa}
                    {v.cliente_nome ? ` — ${v.cliente_nome}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!loadingVeiculos && veiculos.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Nenhum veículo cadastrado. Cadastre um cliente e veículo primeiro.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Km de entrada</label>
            <Input
              type="number"
              placeholder="Ex: 50000"
              value={kmEntrada}
              onChange={(e) => setKmEntrada(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Observações (opcional)</label>
            <Input
              placeholder="Ex: Cliente relatou barulho no freio"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar OS"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
      </Dialog>
    </>
  );
}
