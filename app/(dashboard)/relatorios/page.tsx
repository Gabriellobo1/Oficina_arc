import type { Metadata } from "next";
import { RouteGuard } from "@/components/layout/RouteGuard";
import { ReportsContent } from "@/components/reports/ReportsContent";

export const metadata: Metadata = {
  title: "Relatórios Gerenciais",
};

export default function ReportsPage() {
  return (
    // Acesso restrito ao perfil Gerente — conforme enunciado Seção 6.2
    <RouteGuard requiredRole="gerente">
      <ReportsContent />
    </RouteGuard>
  );
}
