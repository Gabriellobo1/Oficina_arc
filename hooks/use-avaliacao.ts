import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { avaliacaoSchema, type AvaliacaoFormValues } from "@/schema/schemaAvaliacao";

interface UseAvaliacaoOptions {
  orderId: string;
  onSuccess?: (nota: number, comentario?: string) => void;
  onClose?: () => void;
}

export function useAvaliacao({ orderId, onSuccess, onClose }: UseAvaliacaoOptions) {
  const [hoverNota, setHoverNota] = useState(0);

  const form = useForm<AvaliacaoFormValues>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      nota: 0,
      comentario: "",
    },
  });

  const { isSubmitting } = form.formState;
  const notaAtual = form.watch("nota");

  async function onSubmit(values: AvaliacaoFormValues) {
    try {
      // Stub — substituir por: await api.post(API_ENDPOINTS.agendamentos.registrarAvaliacao(orderId), values, { token })
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success(`Avaliação de ${values.nota} estrela${values.nota !== 1 ? "s" : ""} registrada com sucesso!`);
      onSuccess?.(values.nota, values.comentario);
      onClose?.();
      form.reset();
    } catch {
      toast.error("Erro ao registrar a avaliação. Tente novamente.");
    }
  }

  return {
    form,
    isSubmitting,
    notaAtual,
    hoverNota,
    setHoverNota,
    onSubmit,
  };
}
