import { Request, Response, NextFunction } from "express";
import { orderService } from "../services/order.service";
import { OrderFilters, OrderStatus, CreateOrderDTO, UpdateOrderStatusDTO } from "../types/order.types";

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
  try{
    const { unit, status, id } = req.query;

    const filters: OrderFilters = {
      unit: unit as string,
      status: status as OrderStatus,
      id: id ? Number(id) : undefined
    };

    const data = await orderService.getAll(filters);
    res.json(data);
  } catch (err) {
    next(err);  
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction  ): Promise<void> => {
  
  try{
    const id = Number(req.params.id);
    const data = await orderService.getById(id);

    if (!data) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
  try {
    const data: CreateOrderDTO = req.body;
    const created = await orderService.create(data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction ): Promise<void> => {
  
  try {
    const id = Number(req.params.id);
    const dto: UpdateOrderStatusDTO = req.body;
    const updated = await orderService.updateStatus(id, dto);
    res.json(updated);
  } catch (err: any) {
    next(err);
  }
};