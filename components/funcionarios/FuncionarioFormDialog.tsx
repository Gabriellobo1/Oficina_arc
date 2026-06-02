"use client";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CARGOS_FUNCIONARIO } from "@/schema/schemaFuncionario";
import type { UseFormReturn } from "react-hook-form";
import type { FuncionarioFormValues } from "@/schema/schemaFuncionario";
import type { Funcionario } from "@/types/funcionario";

interface FuncionarioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<FuncionarioFormValues>;
  onSubmit: (values: FuncionarioFormValues) => Promise<void>;
  isSubmitting: boolean;
  editingFuncionario: Funcionario | null;
}

export function FuncionarioFormDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
  editingFuncionario,
}: FuncionarioFormDialogProps) {
  const isEditing = !!editingFuncionario;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Editar Funcionário" : "Novo Funcionário"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Nome */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input
                      id="func-nome"
                      placeholder="Ex: João da Silva"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Cargo */}
              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger id="func-cargo">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CARGOS_FUNCIONARIO.map((cargo) => (
                          <SelectItem key={cargo} value={cargo}>
                            {cargo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Especialidade */}
              <FormField
                control={form.control}
                name="especialidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Especialidade{" "}
                      <span className="text-muted-foreground font-normal">(opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="func-especialidade"
                        placeholder="Ex: Motor e câmbio"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* E-mail */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      id="func-email"
                      type="email"
                      placeholder="funcionario@oficina.com"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Telefone */}
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        id="func-telefone"
                        placeholder="(84) 99999-9999"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Salário — deve ser > 0 conforme RN do banco */}
              <FormField
                control={form.control}
                name="salario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salário (R$)</FormLabel>
                    <FormControl>
                      <Input
                        id="func-salario"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0,00"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Data de admissão */}
            <FormField
              control={form.control}
              name="dataAdmissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de admissão</FormLabel>
                  <FormControl>
                    <Input
                      id="func-admissao"
                      type="date"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ativo / Inativo */}
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <FormLabel className="text-sm font-medium">
                      Funcionário ativo
                    </FormLabel>
                    <span className="text-xs text-muted-foreground">
                      Funcionários inativos não aparecem nas OS
                    </span>
                  </div>
                  <FormControl>
                    <Switch
                      id="func-ativo"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                id="func-form-cancel"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                id="func-form-submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : isEditing ? (
                  "Salvar alterações"
                ) : (
                  "Cadastrar funcionário"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
