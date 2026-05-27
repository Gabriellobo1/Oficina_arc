import { z } from "zod";

const addressSchema = z.object({
  zipCode: z.string().min(8, "CEP é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z
    .string()
    .min(2, "UF é obrigatória")
    .max(2, "UF deve ter 2 caracteres"),
});

export const clientSchema = z
  .object({
    type: z.enum(["pf", "pj"]),
    name: z.string().optional(),
    cpf: z.string().optional(),
    rg: z.string().optional(),
    companyName: z.string().optional(),
    tradeName: z.string().optional(),
    cnpj: z.string().optional(),
    stateRegistration: z.string().optional(),
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    phone: z.string().min(10, "Telefone inválido (mínimo 10 dígitos)"),
    address: addressSchema,
  })
  .superRefine((data, ctx) => {
    if (data.type === "pf") {
      if (!data.name || data.name.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nome completo é obrigatório (mínimo 3 caracteres)",
          path: ["name"],
        });
      }
      if (!data.cpf || data.cpf.replace(/\D/g, "").length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CPF deve conter 11 dígitos",
          path: ["cpf"],
        });
      }
    }

    if (data.type === "pj") {
      if (!data.companyName || data.companyName.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Razão Social é obrigatória (mínimo 3 caracteres)",
          path: ["companyName"],
        });
      }
      if (!data.tradeName || data.tradeName.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nome Fantasia é obrigatório (mínimo 3 caracteres)",
          path: ["tradeName"],
        });
      }
      if (!data.cnpj || data.cnpj.replace(/\D/g, "").length !== 14) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CNPJ deve conter 14 dígitos",
          path: ["cnpj"],
        });
      }
    }
  });

export type ClientFormValues = z.infer<typeof clientSchema>;
