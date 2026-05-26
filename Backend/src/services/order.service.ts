import { orderRepository } from "../repositories/order.repository";
import { OrderFilters, CreateOrderDTO, UpdateOrderStatusDTO, OrderStatus } from "../types/order.types";

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
// DRAFT is intentionally not stored in DB (handled via localStorage on the frontend).
// Kept here to document the full order lifecycle and enforce transition rules.
  DRAFT: ["SENT"], 
  SENT: ["CONFIRMED"],
  CONFIRMED: ["DELIVERED"],
  DELIVERED: [],
};

export const orderService = {

  getAll: (filters: OrderFilters) => {
    return orderRepository.findAll(filters);
  },

  getById: async (id: number) => {
    return orderRepository.findById(id);
  },

  create: async (data: CreateOrderDTO) => {
    if (!data.unit) throw new Error("unit is required");
    if (!data.items || data.items.length === 0) throw new Error("items are required");

    for (const item of data.items) {
      if (item.quantity <= 0) throw new Error("quantity must be > 0");
    }

    return orderRepository.create(data);
  },

  updateStatus: async (id: number, dto: UpdateOrderStatusDTO) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new Error("Order not found");

    const allowed = allowedTransitions[order.status];
    if (!allowed.includes(dto.status)) {
      throw new Error(`Cannot transition from ${order.status} to ${dto.status}`);
    }

    // Decrease stock when DELIVERED
    if (dto.status === "DELIVERED") {
      await orderRepository.decreaseStock(id);
    }

    return orderRepository.updateStatus(id, dto.status);
  },
};