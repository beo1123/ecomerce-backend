import express from "express";
import * as brand from "./brand.controller.js";
import { validate } from "./../../middlewares/validate.js";
import {
  addBrandValidation,
  deleteBrandValidation,
  updateBrandValidation,
} from "./brand.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const brandRouter = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f0b1f2a2c123456789abcd"
 *         name:
 *           type: string
 *           example: "Nike"
 *         slug:
 *           type: string
 *           example: "nike"
 *         logo:
 *           type: string
 *           example: "https://example.com/logo.png"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /api/v1/brands:
 *   post:
 *     summary: Thêm brand mới
 *     tags:
 *       - Brand
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nike"
 *               logo:
 *                 type: string
 *                 example: "https://example.com/logo.png"
 *     responses:
 *       201:
 *         description: Brand được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 addBrand:
 *                   $ref: '#/components/schemas/Brand'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 */
brandRouter.post(
  "/",
  protectedRoutes,
  allowedTo("admin"),
  validate(addBrandValidation),
  brand.addBrand
);

/**
 * @openapi
 * /api/v1/brands:
 *   get:
 *     summary: Lấy danh sách tất cả brand
 *     tags:
 *       - Brand
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số item mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách brand + phân trang
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
 *                 getAllBrands:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 */
brandRouter.get("/", brand.getAllBrands);

/**
 * @openapi
 * /api/v1/brands/{id}:
 *   put:
 *     summary: Cập nhật brand theo ID
 *     tags:
 *       - Brand
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f0b1f2a2c123456789abcd"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Adidas"
 *               logo:
 *                 type: string
 *                 example: "https://example.com/adidas.png"
 *     responses:
 *       201:
 *         description: Brand được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 updateBrand:
 *                   $ref: '#/components/schemas/Brand'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: Brand không tìm thấy
 */
brandRouter.put(
  "/:id",
  protectedRoutes,
  allowedTo("admin"),
  validate(updateBrandValidation),
  brand.updateBrand
);

/**
 * @openapi
 * /api/v1/brands/{id}:
 *   delete:
 *     summary: Xóa brand theo ID
 *     tags:
 *       - Brand
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f0b1f2a2c123456789abcd"
 *     responses:
 *       200:
 *         description: Xóa brand thành công
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
 *         description: Brand không tìm thấy
 */
brandRouter.delete(
  "/:id",
  protectedRoutes,
  allowedTo("admin"),
  validate(deleteBrandValidation),
  brand.deleteBrand
);

export default brandRouter;
