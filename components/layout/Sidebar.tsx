"use client";

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
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/10">
          <Image
            src="/logo.png"
            alt="Oficina Pro"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight tracking-tight text-sidebar-foreground">
            Oficina Pro
          </span>
          <span className="text-xs text-sidebar-muted">Sistema de Gestão</span>
        </div>
      </div>

      {/* Perfil do usuário logado */}
      {user && (
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/20">
            <span className="text-xs font-semibold text-sidebar-primary">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-xs font-medium text-sidebar-foreground">
              {user.email}
            </span>
            <div className="flex items-center gap-1">
              <Shield className="h-2.5 w-2.5 text-sidebar-muted" />
              <span className="text-xs capitalize text-sidebar-muted">
                {user.perfil === "GERENTE" ? "Gerente" : "Atendente"}
              </span>
            </div>
          </div>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        <span className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted/70">
          Menu
        </span>
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

        <div className="my-3 border-t border-sidebar-border" />

        <span className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted/70">
          Sistema
        </span>
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

      <div className="flex flex-col gap-2 border-t border-sidebar-border px-3 py-3">
        <Button
          id="sidebar-logout-btn"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-xs text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-3.5 w-3.5" />
          Sair
        </Button>
        <p className="px-2 text-xs text-sidebar-muted/70">v1.0.0</p>
      </div>
    </aside>
  );
}
