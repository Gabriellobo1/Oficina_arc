"use client";

import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { ClientFormValues } from "@/schema/schemaClient";

interface ClientPjFieldsProps {
  control: Control<ClientFormValues>;
  isSubmitting: boolean;
}

export function ClientPjFields({ control, isSubmitting }: ClientPjFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="companyName"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Razão Social</FormLabel>
            <FormControl>
              <Input
                id="client-company-name"
                placeholder="Ex: Mecânica Estrela Ltda"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tradeName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Fantasia</FormLabel>
            <FormControl>
              <Input
                id="client-trade-name"
                placeholder="Ex: Oficina Estrela"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="cnpj"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CNPJ</FormLabel>
            <FormControl>
              <Input
                id="client-cnpj"
                placeholder="00.000.000/0000-00"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="stateRegistration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inscrição Estadual (Opcional)</FormLabel>
            <FormControl>
              <Input
                id="client-state-registration"
                placeholder="Isento ou número"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
