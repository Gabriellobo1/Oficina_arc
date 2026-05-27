"use client";

import { useState } from "react";
import { Car, CalendarPlus, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppointmentDialog } from "@/components/agendamentos/AppointmentDialog";
import { AppointmentBadge } from "@/components/agendamentos/AppointmentBadge";
import type { VehicleWithAppointments } from "@/types/client";

interface VehicleCardProps {
  vehicle: VehicleWithAppointments;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col gap-0 overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/40 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">
                  {vehicle.brand} {vehicle.model}
                </span>
                <span className="text-sm text-muted-foreground">
                  {vehicle.year} · {vehicle.color}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-md border bg-background px-2 py-1">
              <Hash className="h-3 w-3 text-muted-foreground" />
              <span className="font-mono text-sm font-semibold tracking-widest">
                {vehicle.plate}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Agendamentos ({vehicle.appointments.length})
            </span>
            <Button
              id={`schedule-vehicle-${vehicle.id}`}
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
              onClick={() => setAppointmentOpen(true)}
            >
              <CalendarPlus className="h-3 w-3" />
              Novo Agendamento
            </Button>
          </div>

          {vehicle.appointments.length > 0 ? (
            <div className="flex flex-col gap-2">
              <Separator />
              {vehicle.appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {appointment.serviceType}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {appointment.date} às {appointment.time}
                    </span>
                  </div>
                  <AppointmentBadge status={appointment.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-md bg-muted/20 py-4 text-center text-xs text-muted-foreground">
              Nenhum agendamento registrado.
            </p>
          )}
        </CardContent>
      </Card>

      <AppointmentDialog
        vehicleId={vehicle.id}
        vehicleLabel={`${vehicle.brand} ${vehicle.model} – ${vehicle.plate}`}
        open={appointmentOpen}
        onOpenChange={setAppointmentOpen}
      />
    </>
  );
}
