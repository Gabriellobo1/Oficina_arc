import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { ClientForm } from "@/components/clientes/ClientForm";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Novo Cliente | Oficina Pro",
  description: "Cadastre um novo cliente pessoa física ou jurídica.",
};

export default function NovoClientePage() {
  return (
    <>
      <Header title="Novo Cliente" subtitle="Preencha os dados para cadastrar" />
      <div className="p-6">
        <div className="mb-4">
          <Link
            href="/clientes"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar para Clientes
          </Link>
        </div>
        <div className="mx-auto max-w-3xl">
          <ClientForm />
        </div>
      </div>
    </>
  );
}
