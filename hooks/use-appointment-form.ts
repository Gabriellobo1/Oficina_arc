import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  appointmentSchema,
  type AppointmentFormValues,
} from "@/schema/schemaAppointment";

interface UseAppointmentFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

export function useAppointmentForm({
  vehicleId,
  onSuccess,
}: UseAppointmentFormProps) {
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
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.info("Appointment scheduled:", values);
      toast.success("Agendamento realizado com sucesso!");
      form.reset();
      onSuccess?.();
    } catch {
      toast.error("Erro ao realizar o agendamento. Tente novamente.");
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit,
  };
}
