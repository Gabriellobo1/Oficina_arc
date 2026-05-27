"use client";

import Link from "next/link";
import { ChevronLeft, User, Building2, Mail, Phone, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { VehicleList } from "@/components/veiculos/VehicleList";
import { useClientDetail } from "@/hooks/use-client-detail";
import { cn } from "@/lib/utils";

interface ClientDetailPageProps {
  params: { id: string };
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
  const { client, isLoading } = useClientDetail(params.id);

  const displayName =
    client?.type === "pf" ? client.name : client?.tradeName ?? client?.companyName;

  return (
    <>
      <Header
        title={displayName ?? "Detalhe do Cliente"}
        subtitle={client?.type === "pf" ? "Pessoa Física" : "Pessoa Jurídica"}
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
                    {client.type === "pf" ? (
                      <User className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    )}
                    Dados Cadastrais
                  </CardTitle>
                  <Badge variant={client.type === "pf" ? "default" : "secondary"}>
                    {client.type === "pf" ? "Pessoa Física" : "Pessoa Jurídica"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {client.type === "pf" ? (
                    <>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nome</span>
                        <span className="text-sm font-medium">{client.name}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">CPF</span>
                        <span className="font-mono text-sm">{client.cpf}</span>
                      </div>
                      {client.rg && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">RG</span>
                          <span className="font-mono text-sm">{client.rg}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-0.5 md:col-span-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Razão Social</span>
                        <span className="text-sm font-medium">{client.companyName}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nome Fantasia</span>
                        <span className="text-sm">{client.tradeName}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">CNPJ</span>
                        <span className="font-mono text-sm">{client.cnpj}</span>
                      </div>
                      {client.stateRegistration && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Inscrição Estadual</span>
                          <span className="text-sm">{client.stateRegistration}</span>
                        </div>
                      )}
                    </>
                  )}

                  <Separator className="md:col-span-2" />

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.phone}</span>
                  </div>

                  <Separator className="md:col-span-2" />

                  <div className="flex items-start gap-2 md:col-span-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm">
                      {client.address.street}, {client.address.number}
                      {client.address.complement && `, ${client.address.complement}`}
                      {" — "}
                      {client.address.neighborhood}, {client.address.city} / {client.address.state}
                      {" — CEP "}{client.address.zipCode}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <VehicleList clientId={client.id} vehicles={client.vehicles} />
          </div>
        )}
      </div>
    </>
  );
}
