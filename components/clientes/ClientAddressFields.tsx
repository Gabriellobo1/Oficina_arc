"use client";

import { MapPin, Loader2 } from "lucide-react";
import type { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { ClientFormValues } from "@/schema/schemaClient";

interface ClientAddressFieldsProps {
  control: Control<ClientFormValues>;
  isSubmitting: boolean;
  isLoadingCep: boolean;
  onCepBlur: (cep: string) => void;
}

export function ClientAddressFields({
  control,
  isSubmitting,
  isLoadingCep,
  onCepBlur,
}: ClientAddressFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Endereço</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FormField
          control={control}
          name="address.zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    id="client-zip-code"
                    placeholder="00000-000"
                    disabled={isSubmitting || isLoadingCep}
                    {...field}
                    onBlur={(e) => {
                      field.onBlur();
                      onCepBlur(e.target.value);
                    }}
                  />
                </FormControl>
                {isLoadingCep && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="address.street"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Rua / Logradouro</FormLabel>
              <FormControl>
                <Input
                  id="client-street"
                  placeholder="Ex: Av. Paulista"
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
          name="address.number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input
                  id="client-address-number"
                  placeholder="123"
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
          name="address.complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento (Opcional)</FormLabel>
              <FormControl>
                <Input
                  id="client-complement"
                  placeholder="Apto 42, Bloco B"
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
          name="address.neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input
                  id="client-neighborhood"
                  placeholder="Bairro"
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
          name="address.city"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input
                  id="client-city"
                  placeholder="São Paulo"
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
          name="address.state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UF</FormLabel>
              <FormControl>
                <Input
                  id="client-state"
                  placeholder="SP"
                  maxLength={2}
                  className="uppercase"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
