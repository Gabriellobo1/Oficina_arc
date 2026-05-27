"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}

export function SidebarNavItem({ href, label, icon: Icon, isActive }: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "sidebar-transition flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
      )}
      style={
        isActive
          ? {
              background: "hsl(var(--sidebar-accent))",
              color: "hsl(var(--sidebar-primary))",
              boxShadow: "inset 2px 0 0 hsl(var(--sidebar-primary))",
            }
          : {
              color: "hsl(var(--sidebar-muted))",
            }
      }
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.background =
            "hsl(var(--sidebar-accent))";
          (e.currentTarget as HTMLAnchorElement).style.color =
            "hsl(var(--sidebar-accent-foreground))";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
          (e.currentTarget as HTMLAnchorElement).style.color =
            "hsl(var(--sidebar-muted))";
        }
      }}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}
