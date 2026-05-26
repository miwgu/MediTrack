export type OrderStatus =
  | "DRAFT"
  | "SENT"
  | "CONFIRMED"
  | "DELIVERED";

export type OrderFilters = {
  unit?: string;
};

export type Order = {
  id: number;
  status: OrderStatus;
  unit: string;

  created_at?: string;
  updated_at?: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  medicine_id: number;
  quantity: number;
};

export type OrderWithItems = {
  id: number;
  status: OrderStatus;
  unit: string;
  items: OrderItem[];

  created_at?: string;
  updated_at?: string;
};

export type CreateOrderDTO = {
  unit: string;
  items: {
    medicine_id: number;
    quantity: number;
  }[];
};

export type UpdateOrderStatusDTO = {
  status: OrderStatus;
};