import { db } from "../db/db";
import { OrderFilters, Order, OrderWithItems, CreateOrderDTO } from "../types/order.types";

export const orderRepository = {

  async findAll(filters: OrderFilters): Promise<OrderWithItems[]> {
    const { unit, status, id } = filters;

    const ordersResult = await db.query(
     `SELECT * FROM orders
      WHERE ($1::text IS NULL OR unit ILIKE '%' || $1 || '%')
      AND ($2::text IS NULL OR status = $2)
      AND ($3::int IS NULL OR id = $3)
      ORDER BY created_at DESC`,
      [unit ?? null, status ?? null, id ?? null]
    );

    const orders = ordersResult.rows;
    if (orders.length === 0) return [];

    const orderIds = orders.map((o: Order) => o.id);
    const itemsResult = await db.query(
      "SELECT * FROM order_items WHERE order_id = ANY($1::int[])",
      [orderIds]
    );

    return orders.map((order: Order) => ({
      ...order,
      items: itemsResult.rows.filter((item: any) => item.order_id === order.id),
    }));
  },

  async findById(id: number): Promise<OrderWithItems | null> {
    const orderResult = await db.query(
      "SELECT * FROM orders WHERE id = $1", [id]
    );
    if (!orderResult.rows[0]) return null;

    const itemsResult = await db.query(
      `SELECT 
        oi.id,
        oi.order_id,
        oi.medicine_id,
        oi.quantity,
        m.name AS medicine_name,
        m.atc_code AS medicine_atc_code,
        m.form AS medicine_form,
        m.strength AS medicine_strength
      FROM order_items oi
      JOIN medicines m ON m.id = oi.medicine_id
      WHERE oi.order_id = $1`,
      [id]
    );

    return {
      ...orderResult.rows[0],
      items: itemsResult.rows,
    };
  },

  async create(data: CreateOrderDTO): Promise<OrderWithItems> {
    // Insert order
    const orderResult = await db.query(
      `INSERT INTO orders (status, unit) VALUES ('SENT', $1) RETURNING *`,
      [data.unit]
    );

    const order = orderResult.rows[0];

    // Insert order items
    for (const item of data.items) {
      await db.query(
        `INSERT INTO order_items (order_id, medicine_id, quantity) VALUES ($1, $2, $3)`,
        [order.id, item.medicine_id, item.quantity]
      );
    }

    const itemsResult = await db.query(
      "SELECT * FROM order_items WHERE order_id = $1", [order.id]
    );

    return { ...order, items: itemsResult.rows };
  },

  async updateStatus(id: number, status: string): Promise<Order> {
    const result = await db.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  },

  // Used when DELIVERED — reduce stock for each item
  async decreaseStock(orderId: number): Promise<void> {
    const itemsResult = await db.query(
      "SELECT * FROM order_items WHERE order_id = $1", [orderId]
    );

    for (const item of itemsResult.rows) {
      await db.query(
        `UPDATE medicines SET stock = stock - $1, updated_at = NOW() WHERE id = $2`,
        [item.quantity, item.medicine_id]
      );
    }
  },
};