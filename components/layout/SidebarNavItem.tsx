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
        "sidebar-transition group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
        isActive
          ? "bg-sidebar-primary/15 text-sidebar-primary"
          : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
      )}
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-sidebar-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}
