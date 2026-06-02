import { useState } from "react";
import type { Order, OrderStatus } from "@/types/models";

const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: "OS-2026-001",
    clientName: "Carlos Silva",
    vehicle: "Honda Civic 2020",
    status: "Agendado",
    odometerIn: 45000,
    services: [],
    parts: [],
    total: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "OS-2026-002",
    clientName: "Mariana Souza",
    vehicle: "Jeep Renegade 2021",
    status: "Em Andamento",
    odometerIn: 32000,
    services: [
      { id: "s1", serviceName: "Troca de Óleo", price: 150, employeeId: "e1" },
    ],
    parts: [
      { id: "pc1", partId: "p1", quantity: 4, unitPrice: 45 },
    ],
    total: 330,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "OS-2026-003",
    clientName: "Roberto Alves",
    vehicle: "VW Polo 2019",
    status: "Agendado",
    odometerIn: 78000,
    services: [
      { id: "s2", serviceName: "Troca de Pastilhas", price: 200, employeeId: "e2" },
    ],
    parts: [],
    total: 200,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "OS-2026-004",
    clientName: "Juliana Costa",
    vehicle: "Toyota Corolla 2022",
    status: "Concluído",
    odometerIn: 25000,
    odometerOut: 25010,
    services: [
      { id: "s3", serviceName: "Revisão 25k", price: 350, employeeId: "e1" },
    ],
    parts: [
      { id: "pc2", partId: "p2", quantity: 1, unitPrice: 25 },
    ],
    total: 375,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    closedAt: new Date(Date.now() - 86400000).toISOString(),
    paymentMethod: "credit_card",
    installments: 3,
  },
  {
    id: "OS-2026-005",
    clientName: "Fernando Gomes",
    vehicle: "Fiat Strada 2023",
    status: "Cancelado",
    odometerIn: 12000,
    services: [],
    parts: [],
    total: 0,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "OS-2026-006",
    clientName: "Beatriz Mendes",
    vehicle: "Renault Kwid 2022",
    status: "No-show",
    odometerIn: 8500,
    services: [],
    parts: [],
    total: 0,
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
];

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_MOCK_ORDERS);

  function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }

  function getOrderById(id: string) {
    return orders.find((o) => o.id === id);
  }

  return {
    orders,
    updateOrderStatus,
    getOrderById,
  };
}
