export type ClientType = "pf" | "pj";

export type AppointmentStatus =
  | "Agendado"
  | "Em Andamento"
  | "Concluído"
  | "Cancelado";

export interface Address {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Client {
  id: string;
  type: ClientType;
  name?: string;
  cpf?: string;
  rg?: string;
  companyName?: string;
  tradeName?: string;
  cnpj?: string;
  stateRegistration?: string;
  email: string;
  phone: string;
  address: Address;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  clientId: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
}

export interface Appointment {
  id: string;
  vehicleId: string;
  date: string;
  time: string;
  serviceType: string;
  description?: string;
  status: AppointmentStatus;
}

export interface ClientWithVehicles extends Client {
  vehicles: VehicleWithAppointments[];
}

export interface VehicleWithAppointments extends Vehicle {
  appointments: Appointment[];
}
