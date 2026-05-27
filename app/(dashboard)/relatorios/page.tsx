import type { Metadata } from "next";
import { ReportsContent } from "@/components/reports/ReportsContent";

export const metadata: Metadata = {
  title: "Relatórios Gerenciais",
};

export default function ReportsPage() {
  return <ReportsContent />;
}
