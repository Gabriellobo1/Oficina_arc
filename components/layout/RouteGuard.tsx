"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface RouteGuardProps {
  children: React.ReactNode;
  /**
   * Perfil mínimo exigido para acessar esta rota.
   * - undefined → apenas autenticação é necessária
   * - "gerente"  → somente Gerentes/Admins passam
   */
  requiredRole?: string;
}

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (requiredRole) {
      const isAllowed =
        (requiredRole === "gerente" || requiredRole === "admin")
          ? (user?.role === "gerente" || user?.role === "admin")
          : (user?.role === requiredRole);

      if (!isAllowed) {
        router.replace("/acesso-negado");
      }
    }
  }, [isAuthenticated, user, requiredRole, router]);

  if (!isAuthenticated) return null;

  if (requiredRole) {
    const isAllowed =
      (requiredRole === "gerente" || requiredRole === "admin")
        ? (user?.role === "gerente" || user?.role === "admin")
        : (user?.role === requiredRole);

    if (!isAllowed) return null;
  }

  return <>{children}</>;
}
