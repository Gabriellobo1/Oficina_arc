"use client";

import { useState } from "react";
import { Plus, Car } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VehicleCard } from "@/components/veiculos/VehicleCard";
import { VehicleForm } from "@/components/veiculos/VehicleForm";
import type { VehicleWithAppointments } from "@/types/client";

interface VehicleListProps {
  clientId: string;
  vehicles: VehicleWithAppointments[];
}

export function VehicleList({ clientId, vehicles }: VehicleListProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-base font-semibold">
            Veículos ({vehicles.length})
          </h2>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            id="add-vehicle-btn"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Plus className="mr-1 h-4 w-4" />
            Adicionar Veículo
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Novo Veículo</DialogTitle>
              <DialogDescription>
                Cadastre um novo veículo para este cliente.
              </DialogDescription>
            </DialogHeader>
            <VehicleForm
              clientId={clientId}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 py-12">
          <Car className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            Nenhum veículo cadastrado
          </p>
          <p className="text-xs text-muted-foreground">
            Clique em &quot;Adicionar Veículo&quot; para registrar o primeiro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
