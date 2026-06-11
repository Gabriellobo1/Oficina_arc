import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { AvaliacoesContent } from "@/components/avaliacoes/AvaliacoesContent";

export const metadata: Metadata = {
  title: "Avaliações | Oficina Pro",
  description: "Avaliações dos clientes.",
};

export default function AvaliacoesPage() {
  return (
    <>
      <Header title="Avaliações" subtitle="Feedback dos clientes sobre os serviços" />
      <div className="p-6">
        <AvaliacoesContent />
      </div>
    </>
  );
}
