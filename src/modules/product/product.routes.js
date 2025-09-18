import express from "express";
import * as product from "./product.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  addProductValidation,
  deleteProductValidation,
  getSpecificProductValidation,
  updateProductValidation,
} from "./product.validation.js";
import { uploadMultipleFiles } from "../../../multer/multer.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const productRouter = express.Router();

let arrFields = [
  { name: "imgCover", maxCount: 1 },
  { name: "images", maxCount: 20 },
];

/**
 * Middleware: normalize colors field BEFORE validation
 * Accepts:
 * - "red" -> ["red"]
 * - "red,blue" -> ["red","blue"]
 * - '["red","blue"]' -> ["red","blue"]
 * - already an array -> keep
 */
const normalizeColors = (req, res, next) => {
  if (!req.body || req.body.colors === undefined) return next();

  const val = req.body.colors;

  if (Array.isArray(val)) return next();

  if (typeof val === "string") {
    const s = val.trim();
    // try JSON.parse first: '["a","b"]'
    if ((s.startsWith("[") && s.endsWith("]"))) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          req.body.colors = parsed.map((c) => String(c));
          return next();
        }
      } catch (e) {
        // fallthrough
      }
    }
    // comma separated: "red,blue"
    if (s.includes(",")) {
      req.body.colors = s.split(",").map((c) => c.trim()).filter(Boolean);
      return next();
    }
    // single string: "red"
    req.body.colors = [s];
    return next();
  }

  // other types -> coerce to string in array
  req.body.colors = [String(val)];
  next();
};

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Thêm sản phẩm mới
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "iPhone 15"
 *               imgCover:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               descripton:
 *                 type: string
 *                 example: "New generation iPhone"
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Black", "Silver", "Blue"]
 *               price:
 *                 type: number
 *                 example: 999
 *               priceAfterDiscount:
 *                 type: number
 *                 example: 899
 *               quantity:
 *                 type: number
 *                 example: 50
 *               category:
 *                 type: string
 *                 example: "64df82b98c75a8c30f7a12e4"
 *               subcategory:
 *                 type: string
 *                 example: "64df82b98c75a8c30f7a12e5"
 *               brand:
 *                 type: string
 *                 example: "64df82b98c75a8c30f7a12e6"
 *     responses:
 *       201:
 *         description: Product created successfully
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products
 */
productRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin", "user"),
    uploadMultipleFiles(arrFields, "products"),
    normalizeColors, // -> normalize BEFORE validate
    validate(addProductValidation),
    product.addProduct
  )
  .get(product.getAllProducts);

/**
 * @openapi
 * /api/v1/products/slug/{slug}:
 *   get:
 *     summary: Lấy thông tin chi tiết sản phẩm theo slug
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details by slug
 *       404:
 *         description: Product not found
 */
// đặt route slug BEFORE /:id để tránh trùng route
productRouter.get("/slug/:slug", product.getProductBySlug);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết sản phẩm theo ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *   put:
 *     summary: Cập nhật sản phẩm theo ID
 *     tags:
 *       - Product
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
 *               title:
 *                 type: string
 *               descripton:
 *                 type: string
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               category:
 *                 type: string
 *               subcategory:
 *                 type: string
 *               brand:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Xóa sản phẩm theo ID
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
productRouter
  .route("/:id")
  .get(validate(getSpecificProductValidation), product.getProductById)
  .put(
    protectedRoutes,
    allowedTo("admin"),
    // If you want to allow updating images with multipart PUT, you can add uploadMultipleFiles here.
    normalizeColors, // -> normalize BEFORE validate
    validate(updateProductValidation),
    product.updateProduct
  )
  .delete(
    protectedRoutes,
    allowedTo("admin"),
    validate(deleteProductValidation),
    product.deleteProduct
  );

/**
* @openapi
* /api/v1/products/category/{categoryId}:
*   get:
*     summary: Lấy danh sách sản phẩm theo Category
*     tags:
*       - Product
*     parameters:
*       - in: path
*         name: categoryId
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: List of products by category
*       404:
*         description: Category not found
*/
productRouter.get("/category/:categoryId", product.getProductsByCategory);

/**
 * @openapi
 * /api/v1/products/subcategory/{subCategoryId}:
 *   get:
 *     summary: Lấy danh sách sản phẩm theo SubCategory
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products by subcategory
 *       404:
 *         description: SubCategory not found
 */
productRouter.get("/subcategory/:subCategoryId", product.getProductsBySubCategory);

export default productRouter;
