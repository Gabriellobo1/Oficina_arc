import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ConfiguracoesContent } from "@/components/configuracoes/ConfiguracoesContent";

export const metadata: Metadata = {
  title: "Configurações | Oficina Pro",
  description: "Preferências da conta e do sistema.",
};

export default function ConfiguracoesPage() {
  return (
    <>
      <Header title="Configurações" subtitle="Preferências da conta e do sistema" />
      <div className="p-6">
        <ConfiguracoesContent />
      </div>
    </>
  );
}
