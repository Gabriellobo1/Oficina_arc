import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { RouteGuard } from "@/components/layout/RouteGuard";
import { PagamentosContent } from "@/components/pagamentos/PagamentosContent";

export const metadata: Metadata = {
  title: "Pagamentos | Oficina Pro",
  description: "Pagamentos registrados na oficina.",
};

export default function PagamentosPage() {
  return (
    <RouteGuard requiredRole="GERENTE">
      <Header title="Pagamentos" subtitle="Controle financeiro dos serviços" />
      <div className="p-6">
        <PagamentosContent />
      </div>
    </RouteGuard>
  );
}
