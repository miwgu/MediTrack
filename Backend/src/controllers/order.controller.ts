import { Request, Response } from "express";
import { orderService } from "../services/order.service";
import { CreateOrderDTO, UpdateOrderStatusDTO } from "../types/order.types";

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  const data = await orderService.getAll();
  res.json(data);
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const data = await orderService.getById(id);

  if (!data) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  res.json(data);
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const data: CreateOrderDTO = req.body;
  const created = await orderService.create(data);
  res.status(201).json(created);
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const dto: UpdateOrderStatusDTO = req.body;

  try {
    const updated = await orderService.updateStatus(id, dto);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};