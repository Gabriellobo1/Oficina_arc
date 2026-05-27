import { z } from "zod";

export const SERVICE_TYPES = [
  "Revisão Geral",
  "Troca de Óleo",
  "Alinhamento e Balanceamento",
  "Troca de Freios",
  "Troca de Pneus",
  "Diagnóstico Eletrônico",
  "Suspensão",
  "Sistema Elétrico",
  "Ar Condicionado",
  "Funilaria e Pintura",
  "Outros",
] as const;

export const appointmentSchema = z.object({
  vehicleId: z.string().min(1, "Selecione um veículo"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  serviceType: z.enum(SERVICE_TYPES, {
    error: "Selecione um tipo de serviço",
  }),
  description: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
