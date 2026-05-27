"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";


const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/veiculos", label: "Veículos", icon: Car },
  { href: "/funcionarios", label: "Funcionários", icon: UserCog },
  { href: "/ordens-de-servico", label: "Ordens de Serviço", icon: ClipboardList },
  { href: "/pecas", label: "Peças / Estoque", icon: Package },
  { href: "/pagamentos", label: "Pagamentos", icon: CreditCard },
  { href: "/avaliacoes", label: "Avaliações", icon: Star },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
];

const secondaryNavItems = [
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

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
        className="border-t px-4 py-4"
        style={{ borderColor: "hsl(var(--sidebar-border))" }}
      >
        <p className="text-xs" style={{ color: "hsl(var(--sidebar-muted))" }}>
          v1.0.0
        </p>
      </div>
    </aside>
  );
}
