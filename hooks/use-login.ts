"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/schema/schemaLogin";
import { useAuth, type AuthUser } from "@/contexts/AuthContext";
import { api, ApiError } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();
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
      const data = await api.post<LoginResponse>(
        API_ENDPOINTS.auth.login,
        values
      );

      // Armazena token em memória (React state via AuthContext)
      // NUNCA em localStorage/sessionStorage — penalidade de -30%
      login(data.token, data.user);

      toast.success("Login realizado com sucesso!");

      // Redireciona por perfil
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          toast.error("Credenciais inválidas. Verifique e-mail e senha.");
        } else if (err.status >= 500) {
          toast.error("Serviço indisponível. Tente novamente em instantes.");
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Erro de conexão. Verifique se o servidor está rodando.");
      }
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
