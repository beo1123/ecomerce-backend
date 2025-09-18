import express from "express";
import * as coupon from "./coupon.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  createCouponValidation,
  deleteCouponValidation,
  getSpecificCouponValidation,
  updateCouponValidation,
} from "./coupon.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const couponRouter = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f0b1f2a2c123456789abcd"
 *         code:
 *           type: string
 *           example: "SUMMER10"
 *         discount:
 *           type: number
 *           example: 10
 *         expires:
 *           type: string
 *           format: date-time
 *           example: "2025-12-31T23:59:59.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CouponWithQRCode:
 *       allOf:
 *         - $ref: '#/components/schemas/Coupon'
 *         - type: object
 *           properties:
 *             url:
 *               type: string
 *               example: "data:image/png;base64,iVBORw0KGgoAAAANS..."
 */

/**
 * @openapi
 * /api/v1/coupons:
 *   post:
 *     summary: Tạo coupon mới
 *     tags:
 *       - Coupon
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount
 *               - expires
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER10
 *               discount:
 *                 type: number
 *                 example: 10
 *               expires:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59.000Z"
 *     responses:
 *       201:
 *         description: Coupon được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 createCoupon:
 *                   $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 */
couponRouter.post(
  "/",
  protectedRoutes,
  allowedTo("user", "admin"),
  validate(createCouponValidation),
  coupon.createCoupon
);

/**
 * @openapi
 * /api/v1/coupons:
 *   get:
 *     summary: Lấy tất cả coupon
 *     tags:
 *       - Coupon
 *     responses:
 *       200:
 *         description: Danh sách coupon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 getAllCoupons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coupon'
 */
couponRouter.get("/", coupon.getAllCoupons);

/**
 * @openapi
 * /api/v1/coupons/{id}:
 *   get:
 *     summary: Lấy coupon theo ID và QRCode
 *     tags:
 *       - Coupon
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f0b1f2a2c123456789abcd
 *     responses:
 *       200:
 *         description: Trả về thông tin coupon và QRCode
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 getSpecificCoupon:
 *                   $ref: '#/components/schemas/Coupon'
 *                 url:
 *                   type: string
 *                   example: "data:image/png;base64,iVBORw0KGgoAAAANS..."
 *       404:
 *         description: Coupon không tồn tại
 */
couponRouter.get(
  "/:id",
  validate(getSpecificCouponValidation),
  coupon.getSpecificCoupon
);

/**
 * @openapi
 * /api/v1/coupons/{id}:
 *   put:
 *     summary: Cập nhật coupon theo ID
 *     tags:
 *       - Coupon
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f0b1f2a2c123456789abcd
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER15
 *               discount:
 *                 type: number
 *                 example: 15
 *               expires:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59.000Z"
 *     responses:
 *       200:
 *         description: Coupon cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 updateCoupon:
 *                   $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: Coupon không tồn tại
 */
couponRouter.put(
  "/:id",
  protectedRoutes,
  allowedTo("admin", "user"),
  validate(updateCouponValidation),
  coupon.updateCoupon
);

/**
 * @openapi
 * /api/v1/coupons/{id}:
 *   delete:
 *     summary: Xóa coupon theo ID
 *     tags:
 *       - Coupon
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f0b1f2a2c123456789abcd
 *     responses:
 *       200:
 *         description: Xóa coupon thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: Coupon không tồn tại
 */
couponRouter.delete(
  "/:id",
  protectedRoutes,
  allowedTo("user", "admin"),
  validate(deleteCouponValidation),
  coupon.deleteCoupon
);

export default couponRouter;
