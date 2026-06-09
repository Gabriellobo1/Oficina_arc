"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/schema/schemaLogin";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types/auth";

const ROLE_REDIRECT: Record<UserRole, string> = {
  GERENTE: "/dashboard",
  ATENDENTE: "/ordens-de-servico",
};

export function useLogin() {
  const router = useRouter();
  const { signIn } = useAuth();
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
      const usuario = await signIn(values.email, values.password);
      toast.success("Login realizado com sucesso!");
      router.push(ROLE_REDIRECT[usuario.perfil] ?? "/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Credenciais inválidas. Tente novamente.";
      toast.error(message);
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
