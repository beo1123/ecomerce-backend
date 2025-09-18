import express from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import * as order from "./order.controller.js";

const orderRouter = express.Router();

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   post:
 *     summary: Tạo đơn hàng COD
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   phone:
 *                     type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 */
orderRouter.post("/:id", protectedRoutes, allowedTo("user"), order.createCashOrder);

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: Lấy các đơn hàng của user hiện tại
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 */
orderRouter.get("/", protectedRoutes, allowedTo("user"), order.getUserOrders);

/**
 * @openapi
 * /api/v1/orders/all:
 *   get:
 *     summary: Lấy tất cả đơn hàng (admin)
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 */
orderRouter.get("/all", protectedRoutes, allowedTo("admin"), order.getAllOrders);

/**
 * @openapi
 * /api/v1/orders/update/{orderId}:
 *   patch:
 *     summary: Cập nhật trạng thái order
 *     tags:
 *       - Order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPaid:
 *                 type: boolean
 *               isDelivered:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Order updated successfully
 */
orderRouter.patch("/update/:orderId", protectedRoutes, allowedTo("admin"), order.updateOrder);

export default orderRouter;
