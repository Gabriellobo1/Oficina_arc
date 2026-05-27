"use client";

import Link from "next/link";
import { Search, Plus, User, Building2, Eye } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useClientsTable } from "@/hooks/use-clients-table";
import type { Client } from "@/types/client";

function ClientDisplayName({ client }: { client: Client }) {
  if (client.type === "pf") {
    return <span className="font-medium">{client.name}</span>;
  }
  return (
    <div className="flex flex-col">
      <span className="font-medium">{client.tradeName}</span>
      <span className="text-xs text-muted-foreground">{client.companyName}</span>
    </div>
  );
}

function ClientDocument({ client }: { client: Client }) {
  if (client.type === "pf") return <span>{client.cpf}</span>;
  return <span>{client.cnpj}</span>;
}

export function ClientsTable() {
  const { clients, searchTerm, setSearchTerm, typeFilter, setTypeFilter, isLoading } =
    useClientsTable();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="clients-search"
              placeholder="Buscar por nome, CPF ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={(val) =>
              setTypeFilter(val as "all" | "pf" | "pj")
            }
          >
            <SelectTrigger id="clients-type-filter" className="w-[160px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pf">Pessoa Física</SelectItem>
              <SelectItem value="pj">Pessoa Jurídica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Link
          id="clients-new-btn"
          href="/clientes/novo"
          className={cn(buttonVariants({ variant: "default" }), "gap-2")}
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Link>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>CPF / CNPJ</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Cidade / UF</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-muted-foreground"
                >
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id} className="group">
                  <TableCell>
                    <ClientDisplayName client={client} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={client.type === "pf" ? "default" : "secondary"}
                      className="gap-1"
                    >
                      {client.type === "pf" ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Building2 className="h-3 w-3" />
                      )}
                      {client.type === "pf" ? "PF" : "PJ"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    <ClientDocument client={client} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{client.email}</span>
                      <span className="text-xs text-muted-foreground">
                        {client.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.address.city} / {client.address.state}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      id={`client-detail-${client.id}`}
                      href={`/clientes/${client.id}`}
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        {clients.length} cliente{clients.length !== 1 ? "s" : ""} encontrado
        {clients.length !== 1 ? "s" : ""}.
      </p>
    </div>
  );
}
