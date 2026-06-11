"use client";

import { Moon, Sun, User, Shield, Server, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE_URL } from "@/lib/apiEndpoints";

export function ConfiguracoesContent() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" /> Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> Email
            </span>
            <span className="font-medium">{user?.email ?? "—"}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4" /> Perfil
            </span>
            <span className="font-medium">
              {user?.perfil === "GERENTE" ? "Gerente" : "Atendente"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sun className="h-4 w-4" /> Aparência
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tema da interface</span>
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("light")}
            >
              <Sun className="mr-2 h-4 w-4" /> Claro
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("dark")}
            >
              <Moon className="mr-2 h-4 w-4" /> Escuro
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="h-4 w-4" /> Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">API</span>
            <span className="font-mono text-xs">{API_BASE_URL}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Versão</span>
            <span className="font-medium">v1.0.0</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
