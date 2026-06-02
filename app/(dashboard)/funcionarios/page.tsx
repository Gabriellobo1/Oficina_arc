import type { Metadata } from "next";
import { RouteGuard } from "@/components/layout/RouteGuard";
import { FuncionariosContent } from "@/components/funcionarios/FuncionariosContent";

export const metadata: Metadata = {
  title: "Funcionários",
};

export default function FuncionariosPage() {
  return (
    // Acesso restrito ao perfil Gerente
    <RouteGuard requiredRole="gerente">
      <FuncionariosContent />
    </RouteGuard>
  );
}
