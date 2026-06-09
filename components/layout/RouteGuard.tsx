"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: "GERENTE" | "ATENDENTE";
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
        requiredRole === "GERENTE"
          ? user?.perfil === "GERENTE"
          : user?.perfil === requiredRole;

      if (!isAllowed) {
        router.replace("/acesso-negado");
      }
    }
  }, [isAuthenticated, user, requiredRole, router]);

  if (!isAuthenticated) return null;

  if (requiredRole) {
    const isAllowed =
      requiredRole === "GERENTE"
        ? user?.perfil === "GERENTE"
        : user?.perfil === requiredRole;

    if (!isAllowed) return null;
  }

  return <>{children}</>;
}
