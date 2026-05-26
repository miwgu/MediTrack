import { Router } from 'express';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.createOrder);
router.patch("/:id/status", orderController.updateOrderStatus);

// ----------------------------------------------------
// Future endpoints (not implemented in current scope)
// DRAFT orders are currently managed client-side via localStorage.
// If DRAFT persistence is required in the future, the following
// endpoints would be needed to support full draft management:
//
// router.patch("/:id", orderController.updateOrder);
// router.delete("/:id", orderController.deleteOrder);
// router.post("/:id/items", orderController.addOrderItem);
// router.patch("/:id/items/:itemId", orderController.updateOrderItem);
// router.delete("/:id/items/:itemId", orderController.deleteOrderItem);
// ----------------------------------------------------

export default router;