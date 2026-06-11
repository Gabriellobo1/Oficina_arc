"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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

export interface VeiculoRow {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string | null;
  cliente_id?: string;
  cliente_nome?: string;
}

export interface ClienteOption {
  id: string;
  nome: string;
}

interface VehicleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: VeiculoRow | null;
  clientes: ClienteOption[];
  onSaved: () => void;
}

const ANO_ATUAL = new Date().getFullYear();

export function VehicleFormDialog({
  open,
  onOpenChange,
  vehicle,
  clientes,
  onSaved,
}: VehicleFormDialogProps) {
  const { getToken } = useAuth();
  const isEditing = !!vehicle;

  const [clienteId, setClienteId] = useState("");
  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [cor, setCor] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setClienteId(vehicle?.cliente_id ?? "");
    setPlaca(vehicle?.placa ?? "");
    setMarca(vehicle?.marca ?? "");
    setModelo(vehicle?.modelo ?? "");
    setAno(vehicle ? String(vehicle.ano) : String(ANO_ATUAL));
    setCor(vehicle?.cor ?? "");
  }, [open, vehicle]);

  async function handleSave() {
    const placaTrim = placa.trim().toUpperCase();
    if (!clienteId) return toast.error("Selecione o cliente.");
    if (placaTrim.length < 7 || placaTrim.length > 8)
      return toast.error("Placa deve ter 7 caracteres (ex: ABC1D23).");
    if (!marca.trim()) return toast.error("Informe a marca.");
    if (!modelo.trim()) return toast.error("Informe o modelo.");
    const anoNum = Number(ano);
    if (!ano || Number.isNaN(anoNum) || anoNum < 1900 || anoNum > ANO_ATUAL + 1)
      return toast.error("Informe um ano válido.");

    setSaving(true);
    try {
      const payload = {
        clienteId,
        placa: placaTrim,
        marca: marca.trim(),
        modelo: modelo.trim(),
        ano: anoNum,
        cor: cor.trim() || undefined,
      };

      if (isEditing && vehicle) {
        await api.put(API_ENDPOINTS.veiculos.update(vehicle.id), payload, {
          token: getToken(),
        });
        toast.success("Veículo atualizado!");
      } else {
        await api.post(API_ENDPOINTS.veiculos.create, payload, { token: getToken() });
        toast.success("Veículo cadastrado!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar o veículo.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Veículo" : "Novo Veículo"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os dados do veículo."
              : "Cadastre um novo veículo para um cliente."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Cliente</label>
            <Select value={clienteId} onValueChange={(v) => setClienteId(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Placa</label>
              <Input
                placeholder="ABC1D23"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                maxLength={8}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Ano</label>
              <Input
                type="number"
                placeholder={String(ANO_ATUAL)}
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Marca</label>
              <Input
                placeholder="Volkswagen"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Modelo</label>
              <Input
                placeholder="Gol"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-medium">Cor (opcional)</label>
              <Input
                placeholder="Branco"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : isEditing ? (
              "Salvar"
            ) : (
              "Cadastrar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
