import { OrderWithItems, CreateOrderDTO, OrderStatus } from '../types/order.types';

const BASE_URL = 'http://localhost:3000/api/orders';

export const orderApi = {
  getAll: async (filters: { unit?: string; status?: OrderStatus } = {}): Promise<OrderWithItems[]> => {
    const params = new URLSearchParams();
    if (filters.unit) params.append('unit', filters.unit);
    if (filters.status) params.append('status', filters.status);

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    return res.json();
  },

  getById: async (id: number): Promise<OrderWithItems> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    return res.json();
  },

  create: async (data: CreateOrderDTO): Promise<OrderWithItems> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateStatus: async (id: number, status: OrderStatus): Promise<OrderWithItems> => {
    const res = await fetch(`${BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
};