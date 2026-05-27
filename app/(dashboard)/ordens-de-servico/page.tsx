import type { Metadata } from "next";
import { OsKanbanBoard } from "@/components/os/OsKanbanBoard";

export const metadata: Metadata = {
  title: "Ordens de Serviço",
};

export default function OrdersPage() {
  return <OsKanbanBoard />;
}
