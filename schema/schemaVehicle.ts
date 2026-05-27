import { z } from "zod";

const currentYear = new Date().getFullYear();

export const vehicleSchema = z.object({
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  year: z
    .number({ error: "Ano inválido" })
    .int()
    .min(1886, "Ano inválido")
    .max(currentYear + 1, `Ano máximo: ${currentYear + 1}`),
  plate: z
    .string()
    .min(7, "Placa inválida")
    .max(8, "Placa inválida")
    .regex(
      /^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/,
      "Formato de placa inválido (ex: ABC1234 ou ABC1D23)"
    ),
  color: z.string().min(1, "Cor é obrigatória"),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
