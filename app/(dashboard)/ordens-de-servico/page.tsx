import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { OsList } from "@/components/os/OsList";

export const metadata: Metadata = {
  title: "Ordens de Serviço",
};

export default function OrdersPage() {
  return (
    <>
      <Header title="Ordens de Serviço" subtitle="Acompanhe o fluxo de veículos na oficina" />
      <div className="p-6">
        <OsList />
      </div>
    </>
  );
}
