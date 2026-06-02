"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/schema/schemaLogin";
import { useAuth } from "@/hooks/use-auth";

const ROLE_REDIRECT: Record<string, string> = {
  admin: "/dashboard",
  mechanic: "/ordens-de-servico",
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
      await signIn(values.email, values.password);
      const role = values.email.includes("mecanico") ? "mechanic" : "admin";
      toast.success("Login realizado com sucesso!");
      router.push(ROLE_REDIRECT[role]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Credenciais inválidas. Tente novamente.";
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
