"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Car,
  UserCog,
  ClipboardList,
  Package,
  CreditCard,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const commonNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/veiculos", label: "Veículos", icon: Car },
  { href: "/ordens-de-servico", label: "Ordens de Serviço", icon: ClipboardList },
  { href: "/pecas", label: "Peças / Estoque", icon: Package },
  { href: "/avaliacoes", label: "Avaliações", icon: Star },
];

// Itens exclusivos do perfil Gerente
const gerenteNavItems = [
  { href: "/funcionarios", label: "Funcionários", icon: UserCog },
  { href: "/pagamentos", label: "Pagamentos", icon: CreditCard },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
];

const secondaryNavItems = [
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const isGerente = user?.perfil === "GERENTE";

  const mainNavItems = isGerente
    ? [...commonNavItems, ...gerenteNavItems]
    : commonNavItems;

  function handleLogout() {
    signOut();
    toast.success("Sessão encerrada com sucesso.");
    router.push("/login");
  }

  return (
    <aside className="flex h-full w-64 flex-col" style={{ background: "hsl(var(--sidebar))" }}>
      <div
        className="flex items-center gap-3 px-6 py-5 border-b"
        style={{ borderColor: "hsl(var(--sidebar-border))" }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden ring-1 ring-white/10">
          <Image
            src="/logo.png"
            alt="Oficina Pro"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span
            className="text-sm font-semibold leading-tight tracking-tight"
            style={{ color: "hsl(var(--sidebar-foreground))" }}
          >
            Oficina Pro
          </span>
          <span className="text-xs" style={{ color: "hsl(var(--sidebar-muted))" }}>
            Sistema de Gestão
          </span>
        </div>
      </div>

      {/* Perfil do usuário logado */}
      {user && (
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 shrink-0">
            <span className="text-xs font-semibold text-primary">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-xs font-medium truncate"
              style={{ color: "hsl(var(--sidebar-foreground))" }}
            >
              {user.email}
            </span>
            <div className="flex items-center gap-1">
              <Shield className="h-2.5 w-2.5" style={{ color: "hsl(var(--sidebar-muted))" }} />
              <span className="text-xs capitalize" style={{ color: "hsl(var(--sidebar-muted))" }}>
                {user.perfil === "GERENTE" ? "Gerente" : "Atendente"}
              </span>
            </div>
          </div>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-0.5">
          {mainNavItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              }
            />
          ))}
        </div>

        <div
          className="my-3 border-t"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        />

        <div className="flex flex-col gap-0.5">
          {secondaryNavItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </nav>

      <div
        className="border-t px-3 py-3 flex flex-col gap-2"
        style={{ borderColor: "hsl(var(--sidebar-border))" }}
      >
        <Button
          id="sidebar-logout-btn"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-xs"
          style={{ color: "hsl(var(--sidebar-muted))" }}
          onClick={handleLogout}
        >
          <LogOut className="h-3.5 w-3.5" />
          Sair
        </Button>
        <p className="text-xs px-2" style={{ color: "hsl(var(--sidebar-muted))" }}>
          v1.0.0
        </p>
      </div>
    </aside>
  );
}
