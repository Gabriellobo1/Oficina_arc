import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { vehicleSchema, type VehicleFormValues } from "@/schema/schemaVehicle";

interface UseVehicleFormProps {
  clientId: string;
  onSuccess?: () => void;
}

export function useVehicleForm({ clientId, onSuccess }: UseVehicleFormProps) {
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
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.info("Vehicle registered for client:", clientId, values);
      toast.success("Veículo cadastrado com sucesso!");
      form.reset();
      onSuccess?.();
    } catch {
      toast.error("Erro ao cadastrar o veículo. Tente novamente.");
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit,
  };
}
