import { z } from "zod";

export const orderBaseSchema = z.object({
  clientName: z.string().min(2, "Nome obrigatório"),
  vehicle: z.string().min(2, "Veículo obrigatório"),
  odometerIn: z.coerce.number().min(0, "Odômetro inválido"),
});

export type OrderBaseFormValues = z.infer<typeof orderBaseSchema>;

export const serviceItemSchema = z.object({
  serviceName: z.string().min(2, "Descrição do serviço obrigatória"),
  price: z.coerce.number().min(0.01, "Preço inválido"),
  employeeId: z.string().min(1, "Selecione o funcionário responsável"),
});

export type ServiceItemFormValues = z.infer<typeof serviceItemSchema>;

export const partConsumptionSchema = z.object({
  partId: z.string().min(1, "Selecione a peça"),
  quantity: z.coerce.number().min(1, "Quantidade inválida"),
});

export type PartConsumptionFormValues = z.infer<typeof partConsumptionSchema>;

export const paymentSchema = z.object({
  method: z.enum(["DINHEIRO", "CARTAO_CREDITO", "CARTAO_DEBITO", "PIX", "BOLETO"]),
  installments: z.coerce.number().min(1).max(12).optional(),
  km_saida: z.coerce.number().int().min(0, "Odômetro de saída inválido"),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export const odometerOutSchema = z.object({
  odometerOut: z.coerce.number().min(0, "Odômetro inválido"),
});

export type OdometerOutFormValues = z.infer<typeof odometerOutSchema>;
