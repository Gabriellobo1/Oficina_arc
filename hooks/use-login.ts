import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/schema/schemaLogin";

export function useLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  async function onSubmit(values: LoginFormValues) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch {
      toast.error("Credenciais inválidas. Tente novamente.");
    }
  }

  return {
    form,
    isSubmitting,
    showPassword,
    togglePasswordVisibility,
    onSubmit,
  };
}
