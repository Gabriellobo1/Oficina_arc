import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { avaliacaoSchema, type AvaliacaoFormValues } from "@/schema/schemaAvaliacao";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";

interface UseAvaliacaoOptions {
  orderId: string;
  onSuccess?: (nota: number, comentario?: string) => void;
  onClose?: () => void;
}

export function useAvaliacao({ orderId, onSuccess, onClose }: UseAvaliacaoOptions) {
  const { getToken } = useAuth();
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
      await api.post(
        API_ENDPOINTS.agendamentos.registrarAvaliacao(orderId),
        { nota: values.nota, comentario: values.comentario },
        { token: getToken() }
      );

      toast.success(
        `Avaliação de ${values.nota} estrela${values.nota !== 1 ? "s" : ""} registrada com sucesso!`
      );
      onSuccess?.(values.nota, values.comentario);
      onClose?.();
      form.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao registrar a avaliação.";
      toast.error(message);
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
