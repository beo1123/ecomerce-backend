import express from "express";
import { validate } from "../../middlewares/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import * as address from "./address.controller.js";
import { addAddressValidation, deleteAddressValidation } from "./address.validation.js";

const addressRouter = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f0b1f2a2c123456789abcd"
 *         city:
 *           type: string
 *           example: "Hanoi"
 *         street:
 *           type: string
 *           example: "123 Main St"
 *         phone:
 *           type: string
 *           example: "+84123456789"
 */

/**
 * @openapi
 * /api/v1/address:
 *   patch:
 *     summary: Thêm địa chỉ mới cho user
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - street
 *               - phone
 *             properties:
 *               city:
 *                 type: string
 *                 example: "Hanoi"
 *               street:
 *                 type: string
 *                 example: "123 Main St"
 *               phone:
 *                 type: string
 *                 example: "+84123456789"
 *     responses:
 *       201:
 *         description: Thêm địa chỉ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 addAddress:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 */
addressRouter.patch(
  "/",
  protectedRoutes,
  allowedTo("user"),
  validate(addAddressValidation),
  address.addAddress
);

/**
 * @openapi
 * /api/v1/address:
 *   delete:
 *     summary: Xóa địa chỉ của user
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *                 example: "64f0b1f2a2c123456789abcd"
 *     responses:
 *       200:
 *         description: Xóa địa chỉ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 removeAddress:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: Không tìm thấy địa chỉ
 */
addressRouter.delete(
  "/",
  protectedRoutes,
  allowedTo("user"),
  validate(deleteAddressValidation),
  address.removeAddress
);

/**
 * @openapi
 * /api/v1/address:
 *   get:
 *     summary: Lấy tất cả địa chỉ của user
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách địa chỉ của user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 getAllAddresses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 */
addressRouter.get("/", protectedRoutes, allowedTo("user"), address.getAllAddresses);

export default addressRouter;
