export type OrderStatus = "Aberta" | "Em Andamento" | "Aguardando Peça" | "Concluída" | "Cancelada";

export interface Part {
  id: string;
  name: string;
  sku: string;
  currentQty: number;
  minQty: number;
  price: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  averageRating: number;
}

export interface ServiceItem {
  id: string;
  serviceName: string;
  price: number;
  employeeId: string;
}

export interface PartConsumption {
  id: string;
  partId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  clientName: string;
  vehicle: string;
  status: OrderStatus;
  odometerIn?: number;
  odometerOut?: number;
  services: ServiceItem[];
  parts: PartConsumption[];
  total: number;
  createdAt: string;
  paymentMethod?: string;
  installments?: number;
}
