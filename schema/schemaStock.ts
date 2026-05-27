import { z } from "zod";

export const partSchema = z.object({
  name: z.string().min(2, "Nome da peça deve ter no mínimo 2 caracteres"),
  sku: z.string().min(3, "SKU obrigatório"),
  currentQty: z.coerce.number().min(0, "Quantidade não pode ser negativa"),
  minQty: z.coerce.number().min(1, "Quantidade mínima deve ser pelo menos 1"),
  price: z.coerce.number().min(0.01, "Preço inválido"),
});

export type PartFormValues = z.infer<typeof partSchema>;
