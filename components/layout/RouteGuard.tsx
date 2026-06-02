"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type UserRole } from "@/contexts/AuthContext";

interface RouteGuardProps {
  children: React.ReactNode;
  /**
   * Perfil mínimo exigido para acessar esta rota.
   * - undefined → apenas autenticação é necessária
   * - "gerente"  → somente Gerentes passam
   */
  requiredRole?: UserRole;
}

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.replace("/acesso-negado");
    }
  }, [isAuthenticated, user, requiredRole, router]);

  if (!isAuthenticated) return null;

  if (requiredRole && user?.role !== requiredRole) return null;

  return <>{children}</>;
}
