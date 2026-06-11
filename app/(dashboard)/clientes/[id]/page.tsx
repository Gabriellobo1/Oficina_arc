"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, User, Building2, Mail, Phone, MapPin, Car, Hash } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { useClientDetail } from "@/hooks/use-client-detail";
import { cn } from "@/lib/utils";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

function ClientDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </CardContent>
      </Card>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = use(params);
  const { client, isLoading } = useClientDetail(id);

  const isPF = client?.tipo === "PF";

  return (
    <>
      <Header
        title={client?.nome ?? "Detalhe do Cliente"}
        subtitle={client ? (isPF ? "Pessoa Física" : "Pessoa Jurídica") : undefined}
      />
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

        {isLoading ? (
          <ClientDetailSkeleton />
        ) : !client ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground">Cliente não encontrado.</p>
            <Link
              href="/clientes"
              className={cn(buttonVariants({ variant: "link" }), "mt-2")}
            >
              Voltar para lista
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    {isPF ? (
                      <User className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    )}
                    Dados Cadastrais
                  </CardTitle>
                  <Badge variant={isPF ? "default" : "secondary"}>
                    {isPF ? "Pessoa Física" : "Pessoa Jurídica"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Nome
                    </span>
                    <span className="text-sm font-medium">{client.nome}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {isPF ? "CPF" : "CNPJ"}
                    </span>
                    <span className="font-mono text-sm">
                      {(isPF ? client.cpf : client.cnpj) ?? "—"}
                    </span>
                  </div>

                  <Separator className="md:col-span-2" />

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.telefone ?? "—"}</span>
                  </div>

                  <Separator className="md:col-span-2" />

                  <div className="flex items-start gap-2 md:col-span-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm">{client.endereco ?? "Endereço não informado"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  Veículos ({client.veiculos?.length ?? 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!client.veiculos || client.veiculos.length === 0 ? (
                  <p className="rounded-md bg-muted/20 py-8 text-center text-sm text-muted-foreground">
                    Nenhum veículo cadastrado.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {client.veiculos.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between rounded-lg border bg-card px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <Car className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {v.marca} {v.modelo}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {v.ano}
                              {v.cor ? ` · ${v.cor}` : ""}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="gap-1 font-mono tracking-widest">
                          <Hash className="h-3 w-3" />
                          {v.placa}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
