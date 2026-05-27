import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clientSchema, type ClientFormValues } from "@/schema/schemaClient";

export function useClientForm() {
  const router = useRouter();
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      type: "pf",
      name: "",
      cpf: "",
      rg: "",
      companyName: "",
      tradeName: "",
      cnpj: "",
      stateRegistration: "",
      email: "",
      phone: "",
      address: {
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      },
    },
  });

  const { isSubmitting } = form.formState;
  const clientType = form.watch("type");

  async function fetchAddressByCep(cep: string) {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado.");
        return;
      }

      form.setValue("address.street", data.logradouro || "");
      form.setValue("address.neighborhood", data.bairro || "");
      form.setValue("address.city", data.localidade || "");
      form.setValue("address.state", data.uf || "");
    } catch {
      toast.error("Erro ao buscar o CEP. Tente novamente.");
    } finally {
      setIsLoadingCep(false);
    }
  }

  async function onSubmit(values: ClientFormValues) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(
        values.type === "pf"
          ? "Cliente Pessoa Física cadastrado com sucesso!"
          : "Cliente Pessoa Jurídica cadastrado com sucesso!"
      );
      router.push("/clientes");
    } catch {
      toast.error("Erro ao cadastrar o cliente. Tente novamente.");
    }
  }

  return {
    form,
    isSubmitting,
    isLoadingCep,
    clientType,
    fetchAddressByCep,
    onSubmit,
  };
}
