import express from "express";
import * as subCategory from "./subcategory.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  addSubCategoryValidation,
  deleteSubCategoryValidation,
  updateSubCategoryValidation,
} from "./subcategory.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const subCategoryRouter = express.Router({ mergeParams: true });

/**
 * @openapi
 * /api/v1/subcategories:
 *   post:
 *     summary: Thêm subcategory mới
 *     tags:
 *       - SubCategory
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
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: "iPhone Accessories"
 *               category:
 *                 type: string
 *                 example: "64f0b1f2a2c123456789abcd"
 *     responses:
 *       201:
 *         description: Subcategory được tạo thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 */
subCategoryRouter.post(
  "/",
  protectedRoutes,
  allowedTo("admin", "user"),
  validate(addSubCategoryValidation),
  subCategory.addSubCategory
);

/**
 * @openapi
 * /api/v1/subcategories:
 *   get:
 *     summary: Lấy tất cả subcategory (có thể filter theo categoryId nếu có trong params)
 *     tags:
 *       - SubCategory
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: "64f0b1f2a2c123456789abcd"
 *     responses:
 *       200:
 *         description: Danh sách subcategory
 */
subCategoryRouter.get("/", subCategory.getAllSubCategories);

/**
 * @openapi
 * /api/v1/subcategories/slug/{slug}:
 *   get:
 *     summary: Lấy subcategory theo slug
 *     tags:
 *       - SubCategory
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: "iphone-accessories"
 *     responses:
 *       200:
 *         description: Subcategory details by slug
 *       404:
 *         description: Subcategory not found
 */
subCategoryRouter.get("/slug/:slug", subCategory.getSubCategoryBySlug);

/**
 * @openapi
 * /api/v1/subcategories/{id}:
 *   put:
 *     summary: Cập nhật subcategory theo ID
 *     tags:
 *       - SubCategory
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Subcategory"
 *               category:
 *                 type: string
 *                 example: "64f0b1f2a2c123456789abcd"
 *     responses:
 *       200:
 *         description: Subcategory cập nhật thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: Subcategory không tồn tại
 */
subCategoryRouter.put(
  "/:id",
  protectedRoutes,
  allowedTo("admin", "user"),
  validate(updateSubCategoryValidation),
  subCategory.updateSubCategory
);

/**
 * @openapi
 * /api/v1/subcategories/{id}:
 *   delete:
 *     summary: Xóa subcategory theo ID
 *     tags:
 *       - SubCategory
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
 *         description: Subcategory xóa thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: Subcategory không tồn tại
 */
subCategoryRouter.delete(
  "/:id",
  protectedRoutes,
  allowedTo("admin", "user"),
  validate(deleteSubCategoryValidation),
  subCategory.deleteSubCategory
);

export default subCategoryRouter;
