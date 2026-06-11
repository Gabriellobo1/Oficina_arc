import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { VehiclesContent } from "@/components/veiculos/VehiclesContent";

export const metadata: Metadata = {
  title: "Veículos | Oficina Pro",
  description: "Veículos cadastrados na oficina.",
};

export default function VeiculosPage() {
  return (
    <>
      <Header title="Veículos" subtitle="Todos os veículos cadastrados" />
      <div className="p-6">
        <VehiclesContent />
      </div>
    </>
  );
}
