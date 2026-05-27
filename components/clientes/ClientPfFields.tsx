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

interface ClientPfFieldsProps {
  control: Control<ClientFormValues>;
  isSubmitting: boolean;
}

export function ClientPfFields({ control, isSubmitting }: ClientPfFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input
                id="client-name"
                placeholder="Ex: João da Silva"
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
        name="cpf"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF</FormLabel>
            <FormControl>
              <Input
                id="client-cpf"
                placeholder="000.000.000-00"
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
        name="rg"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RG (Opcional)</FormLabel>
            <FormControl>
              <Input
                id="client-rg"
                placeholder="00.000.000-0"
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
