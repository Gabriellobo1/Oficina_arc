import type { Metadata } from "next";
import { OrderDetailsContent } from "@/components/os/OrderDetailsContent";

export const metadata: Metadata = {
  title: "Detalhes da OS",
};

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  return <OrderDetailsContent orderId={params.id} />;
}
