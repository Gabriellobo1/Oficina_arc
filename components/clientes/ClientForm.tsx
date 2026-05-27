"use client";

import { Loader2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ClientTypeToggle } from "@/components/clientes/ClientTypeToggle";
import { ClientPfFields } from "@/components/clientes/ClientPfFields";
import { ClientPjFields } from "@/components/clientes/ClientPjFields";
import { ClientAddressFields } from "@/components/clientes/ClientAddressFields";
import { useClientForm } from "@/hooks/use-client-form";

export function ClientForm() {
  const { form, isSubmitting, isLoadingCep, clientType, fetchAddressByCep, onSubmit } =
    useClientForm();

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Informações do Cliente
        </CardTitle>
        <CardDescription>
          Preencha os dados do cliente. Os campos com * são obrigatórios.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <ClientTypeToggle
              value={clientType}
              onChange={(type) => form.setValue("type", type)}
              disabled={isSubmitting}
            />

            <Separator />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {clientType === "pf" ? (
                <ClientPfFields
                  control={form.control}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <ClientPjFields
                  control={form.control}
                  isSubmitting={isSubmitting}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="client-email"
                          type="email"
                          placeholder="cliente@email.com"
                          className="pl-9"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone / WhatsApp</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="client-phone"
                          placeholder="(11) 99999-9999"
                          className="pl-9"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <ClientAddressFields
              control={form.control}
              isSubmitting={isSubmitting}
              isLoadingCep={isLoadingCep}
              onCepBlur={fetchAddressByCep}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                id="client-form-reset"
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Limpar
              </Button>
              <Button
                id="client-form-submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Cadastrar Cliente"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
