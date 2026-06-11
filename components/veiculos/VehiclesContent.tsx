"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Car, Hash, Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";
import {
  VehicleFormDialog,
  type VeiculoRow,
  type ClienteOption,
} from "./VehicleFormDialog";

export function VehiclesContent() {
  const { getToken } = useAuth();
  const [veiculos, setVeiculos] = useState<VeiculoRow[]>([]);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<VeiculoRow | null>(null);

  const [deleting, setDeleting] = useState<VeiculoRow | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const fetchVeiculos = useCallback(() => {
    setIsLoading(true);
    api
      .get<VeiculoRow[]>(API_ENDPOINTS.veiculos.list, { token: getToken() })
      .then(setVeiculos)
      .catch(() => toast.error("Erro ao carregar veículos."))
      .finally(() => setIsLoading(false));
  }, [getToken]);

  useEffect(() => {
    fetchVeiculos();
    api
      .get<{ data: ClienteOption[] }>(`${API_ENDPOINTS.clientes.list}?limit=100`, {
        token: getToken(),
      })
      .then((res) => setClientes(res.data))
      .catch(() => {
        /* select fica vazio; criação avisa para cadastrar cliente */
      });
  }, [fetchVeiculos, getToken]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return veiculos.filter(
      (v) =>
        v.placa.toLowerCase().includes(term) ||
        v.marca.toLowerCase().includes(term) ||
        v.modelo.toLowerCase().includes(term) ||
        (v.cliente_nome ?? "").toLowerCase().includes(term)
    );
  }, [veiculos, search]);

  function handleNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(v: VeiculoRow) {
    setEditing(v);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await api.delete(API_ENDPOINTS.veiculos.delete(deleting.id), { token: getToken() });
      toast.success("Veículo excluído!");
      setDeleting(null);
      fetchVeiculos();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir o veículo.";
      toast.error(message);
    } finally {
      setDeletingBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por placa, modelo ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleNew} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo Veículo
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Veículo</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Ações</TableHead>
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
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <Car className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Nenhum veículo encontrado
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Car className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">
                        {v.marca} {v.modelo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1 font-mono tracking-widest">
                      <Hash className="h-3 w-3" />
                      {v.placa}
                    </Badge>
                  </TableCell>
                  <TableCell>{v.ano}</TableCell>
                  <TableCell>{v.cor ?? "—"}</TableCell>
                  <TableCell>{v.cliente_nome ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(v)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleting(v)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <VehicleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        vehicle={editing}
        clientes={clientes}
        onSaved={fetchVeiculos}
      />

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir veículo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir{" "}
              <span className="font-medium text-foreground">
                {deleting?.marca} {deleting?.modelo} ({deleting?.placa})
              </span>
              ? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleting(null)}
              disabled={deletingBusy}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletingBusy}
            >
              {deletingBusy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
