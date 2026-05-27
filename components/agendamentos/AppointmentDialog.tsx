"use client";

import { CalendarClock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/agendamentos/AppointmentForm";

interface AppointmentDialogProps {
  vehicleId: string;
  vehicleLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDialog({
  vehicleId,
  vehicleLabel,
  open,
  onOpenChange,
}: AppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            <DialogTitle>Novo Agendamento</DialogTitle>
          </div>
          <DialogDescription>
            Veículo: <span className="font-medium text-foreground">{vehicleLabel}</span>
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          vehicleId={vehicleId}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
