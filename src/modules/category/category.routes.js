import express from "express";
import * as category from "./category.controller.js";
import subCategoryRouter from "../subcategory/subcategory.routes.js";
import {
  addCategoryValidation,
  deleteCategoryValidation,
  updateCategoryValidation,
} from "./category.validation.js";
import { validate } from "../../middlewares/validate.js";
import { uploadSingleFile } from "../../../multer/multer.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const categoryRouter = express.Router();

// Nested subcategory
categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);

/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f0b1f2a2c123456789abcd"
 *         name:
 *           type: string
 *           example: "Electronics"
 *         slug:
 *           type: string
 *           example: "electronics"
 *         Image:
 *           type: string
 *           example: "http://localhost:3000/category/electronics.png"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /api/v1/categories:
 *   post:
 *     summary: Thêm category mới
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - Image
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Electronics"
 *               Image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Category được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 addcategory:
 *                   $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 */
categoryRouter.post(
  "/",
  protectedRoutes,
  allowedTo("admin"),
  uploadSingleFile("Image", "category"),
  validate(addCategoryValidation),
  category.addCategory
);

/**
 * @openapi
 * /api/v1/categories:
 *   get:
 *     summary: Lấy danh sách tất cả category
 *     tags:
 *       - Category
 *     responses:
 *       200:
 *         description: Trả về danh sách category
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
 *                 getAllCategories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
categoryRouter.get("/", category.getAllCategories);

/**
 * @openapi
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Cập nhật category theo ID
 *     tags:
 *       - Category
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Electronics"
 *               Image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Category cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 updateCategory:
 *                   $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: Category không tìm thấy
 */
categoryRouter.put(
  "/:id",
  protectedRoutes,
  allowedTo("admin"),
  validate(updateCategoryValidation),
  category.updateCategory
);

/**
 * @openapi
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Xóa category theo ID
 *     tags:
 *       - Category
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
 *         description: Xóa category thành công
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
 *         description: Category không tồn tại
 */
categoryRouter.delete(
  "/:id",
  protectedRoutes,
  allowedTo("admin"),
  validate(deleteCategoryValidation),
  category.deleteCategory
);
/**
 * @openapi
 * /api/v1/categories/slug/{slug}:
 *   get:
 *     summary: Lấy thông tin chi tiết category theo slug
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: "electronics"
 *     responses:
 *       200:
 *         description: Thông tin chi tiết category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category không tìm thấy
 */
categoryRouter.get("/slug/:slug", category.getCategoryBySlug);

export default categoryRouter;
