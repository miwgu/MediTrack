import { Router } from 'express';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.createOrder);
router.patch("/:id/status", orderController.updateOrderStatus);

export default router;