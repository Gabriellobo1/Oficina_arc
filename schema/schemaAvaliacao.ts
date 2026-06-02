import { z } from "zod";

export const avaliacaoSchema = z.object({
  nota: z
    .number({ error: "Selecione uma nota" })
    .int()
    .min(1, "A nota mínima é 1")
    .max(5, "A nota máxima é 5"),
  comentario: z
    .string()
    .max(500, "O comentário não pode ultrapassar 500 caracteres")
    .optional(),
});

export type AvaliacaoFormValues = z.infer<typeof avaliacaoSchema>;
