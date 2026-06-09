import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { vehicleSchema, type VehicleFormValues } from "@/schema/schemaVehicle";
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuth } from "@/hooks/use-auth";

interface UseVehicleFormProps {
  clientId: string;
  onSuccess?: () => void;
}

export function useVehicleForm({ clientId, onSuccess }: UseVehicleFormProps) {
  const { getToken } = useAuth();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      plate: "",
      color: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: VehicleFormValues) {
    try {
      await api.post(
        API_ENDPOINTS.veiculos.create,
        {
          clienteId: clientId,
          placa: values.plate.toUpperCase(),
          marca: values.brand,
          modelo: values.model,
          ano: values.year,
          cor: values.color,
        },
        { token: getToken() }
      );

      toast.success("Veículo cadastrado com sucesso!");
      form.reset();
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar o veículo.";
      toast.error(message);
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit,
  };
}
