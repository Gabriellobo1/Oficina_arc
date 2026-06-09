import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  appointmentSchema,
  type AppointmentFormValues,
} from "@/schema/schemaAppointment";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";

interface UseAppointmentFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

export function useAppointmentForm({ vehicleId, onSuccess }: UseAppointmentFormProps) {
  const { getToken } = useAuth();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      vehicleId: vehicleId ?? "",
      date: "",
      time: "",
      serviceType: undefined,
      description: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: AppointmentFormValues) {
    try {
      const dataHora = new Date(`${values.date}T${values.time}:00`);

      await api.post(
        API_ENDPOINTS.agendamentos.create,
        {
          veiculoId: values.vehicleId,
          aberturaEm: dataHora.toISOString(),
          km_entrada: 0,
          observacoes: values.description,
        },
        { token: getToken() }
      );

      toast.success("Agendamento realizado com sucesso!");
      form.reset();
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao realizar o agendamento.";
      toast.error(message);
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit,
  };
}
