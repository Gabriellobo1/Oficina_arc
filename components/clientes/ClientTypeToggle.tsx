"use client";

import { User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ClientType } from "@/types/client";

interface ClientTypeToggleProps {
  value: ClientType;
  onChange: (type: ClientType) => void;
  disabled?: boolean;
}

export function ClientTypeToggle({
  value,
  onChange,
  disabled,
}: ClientTypeToggleProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">Tipo de Cliente</span>
      <div className="grid grid-cols-2 gap-3">
        <Button
          id="client-type-pf"
          type="button"
          variant={value === "pf" ? "default" : "outline"}
          className="h-11 gap-2 text-sm font-medium"
          onClick={() => onChange("pf")}
          disabled={disabled}
        >
          <User className="h-4 w-4" />
          Pessoa Física (CPF)
        </Button>
        <Button
          id="client-type-pj"
          type="button"
          variant={value === "pj" ? "default" : "outline"}
          className="h-11 gap-2 text-sm font-medium"
          onClick={() => onChange("pj")}
          disabled={disabled}
        >
          <Building2 className="h-4 w-4" />
          Pessoa Jurídica (CNPJ)
        </Button>
      </div>
    </div>
  );
}
