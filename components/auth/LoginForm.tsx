"use client";

import { Eye, EyeOff, Loader2, Wrench } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLogin } from "@/hooks/use-login";

export function LoginForm() {
  const { form, isSubmitting, showPassword, togglePasswordVisibility, onSubmit } =
    useLogin();

  return (
    <div className="flex flex-col items-center justify-center px-8 py-12 lg:px-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 lg:hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden ring-1 ring-border">
            <Image src="/logo.png" alt="Oficina Pro" width={48} height={48} className="object-cover" />
          </div>
          <span className="text-lg font-semibold text-foreground">Oficina Pro</span>
        </div>

        <div className="mb-8 flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Acessar conta
          </h2>
          <p className="text-sm text-muted-foreground">
            Informe suas credenciais para continuar
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      autoComplete="email"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Senha</FormLabel>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                      onClick={() => {}}
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground"
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}
                        disabled={isSubmitting}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Ocultar senha" : "Mostrar senha"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              id="login-submit"
              type="submit"
              className="w-full mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Sistema restrito a usuários autorizados.
        </p>
      </div>
    </div>
  );
}
