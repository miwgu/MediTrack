import { orderRepository } from "../repositories/order.repository";
import { OrderFilters, CreateOrderDTO, UpdateOrderStatusDTO, OrderStatus } from "../types/order.types";
import { AppError } from "../middleware/errorHandler";

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
// DRAFT is intentionally not stored in DB (handled via localStorage on the frontend).
// Kept here to document the full order lifecycle and enforce transition rules.
  DRAFT: ["SENT"], 
  SENT: ["CONFIRMED"],
  CONFIRMED: ["DELIVERED"],
  DELIVERED: [],
};

export const orderService = {

  /**
   * Retrieves all orders with optional filters.
   * @param filters - Optional filters: unit, status, id
   * @returns List of orders with items
   */
  getAll: (filters: OrderFilters) => {
    return orderRepository.findAll(filters);
  },

  /**
   * Retrieves a single order by ID.
   * @param id - Order ID
   * @returns Order with items or null if not found
   */
  getById: async (id: number) => {
    return orderRepository.findById(id);
  },

  /**
   * Creates a new order with SENT status.
   * @param data - Order creation payload with unit and items
   * @throws If unit is missing, items are empty, or quantity is invalid
   */
  create: async (data: CreateOrderDTO) => {
    if (!data.unit) throw new AppError("unit is required", 400);
    if (!data.items || data.items.length === 0) throw new AppError("items are required", 400);

    for (const item of data.items) {
      if (item.quantity <= 0) throw new AppError("quantity must be > 0", 400);
    }

    return orderRepository.create(data);
  },

  /**
   * Updates the status of an order following allowed transition rules.
   * Automatically decreases medicine stock when status is DELIVERED.
   * @param id - Order ID
   * @param dto - New status
   * @throws If order not found or transition is not allowed
   */
  updateStatus: async (id: number, dto: UpdateOrderStatusDTO) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new AppError("Order not found", 404);

    const allowed = allowedTransitions[order.status];
    if (!allowed.includes(dto.status)) {
      throw new AppError(`Cannot transition from ${order.status} to ${dto.status}`, 400);
    }

    // Decrease stock when DELIVERED
    if (dto.status === "DELIVERED") {
      await orderRepository.decreaseStock(id);
    }

    return orderRepository.updateStatus(id, dto.status);
  },
};