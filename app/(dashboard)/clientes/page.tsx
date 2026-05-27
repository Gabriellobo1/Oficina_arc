import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ClientsTable } from "@/components/clientes/ClientsTable";

export const metadata: Metadata = {
  title: "Clientes | Oficina Pro",
  description: "Gerencie os clientes cadastrados na oficina.",
};

export default function ClientesPage() {
  return (
    <>
      <Header title="Clientes" subtitle="Gerencie e cadastre seus clientes" />
      <div className="p-6">
        <ClientsTable />
      </div>
    </>
  );
}
