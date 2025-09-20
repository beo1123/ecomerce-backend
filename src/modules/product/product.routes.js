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
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f0b1f2a2c123456789abcd
 *         title:
 *           type: string
 *           example: iPhone 15
 *         slug:
 *           type: string
 *           example: iphone-15
 *         descripton:
 *           type: string
 *           example: New generation iPhone
 *         imgCover:
 *           type: string
 *           example: http://localhost:3001/products/iphone15-cover.jpg
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             example: http://localhost:3001/products/iphone15-image.jpg
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *             example: Black
 *         price:
 *           type: number
 *           example: 999
 *         priceAfterDiscount:
 *           type: number
 *           example: 899
 *         quantity:
 *           type: number
 *           example: 50
 *         sold:
 *           type: number
 *           example: 10
 *         category:
 *           type: string
 *           example: 64df82b98c75a8c30f7a12e4
 *         subcategory:
 *           type: string
 *           example: 64df82b98c75a8c30f7a12e5
 *         ratingAvg:
 *           type: number
 *           example: 4.5
 *         ratingCount:
 *           type: number
 *           example: 100
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         reviews:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Review"
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f0b1f2a2c123456789abcd
 *         userId:
 *           type: string
 *           example: 64f0b1f2a2c123456789abcd
 *         productId:
 *           type: string
 *           example: 64f0b1f2a2c123456789abcd
 *         rating:
 *           type: number
 *           example: 4
 *         comment:
 *           type: string
 *           example: Great product!
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 */

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
 *             required:
 *               - title
 *               - descripton
 *               - price
 *               - category
 *               - subcategory
 *             properties:
 *               title:
 *                 type: string
 *                 example: iPhone 15
 *               descripton:
 *                 type: string
 *                 example: New generation iPhone
 *               imgCover:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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
 *               sold:
 *                 type: number
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: 64df82b98c75a8c30f7a12e4
 *               subcategory:
 *                 type: string
 *                 example: 64df82b98c75a8c30f7a12e5
 *               ratingAvg:
 *                 type: number
 *                 example: 4.5
 *               ratingCount:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 addProduct:
 *                   $ref: "#/components/schemas/Product"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Category or SubCategory not found
 *       500:
 *         description: Server error
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm với filter, search, sort, pagination và field selection
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *         description: Số trang hiện tại, mặc định là 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           example: 10
 *         description: Số lượng sản phẩm mỗi trang, mặc định là 10, tối đa là 100
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: -createdAt
 *         description: Sắp xếp theo field, dùng - để giảm dần, ví dụ title,-price
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *           example: title,descripton,price,category,subcategory,colors
 *         description: Chọn các field cụ thể để trả về, cách nhau bởi dấu phẩy
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: black
 *         description: Tìm kiếm theo từ khóa trong title, descripton hoặc colors
 *       - in: query
 *         name: price[gte]
 *         schema:
 *           type: number
 *           example: 500
 *         description: Lọc sản phẩm có giá từ mức này trở lên
 *       - in: query
 *         name: price[lte]
 *         schema:
 *           type: number
 *           example: 1000
 *         description: Lọc sản phẩm có giá dưới mức này
 *       - in: query
 *         name: quantity[gte]
 *         schema:
 *           type: number
 *           example: 10
 *         description: Lọc sản phẩm có số lượng từ mức này trở lên
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: 64df82b98c75a8c30f7a12e4
 *         description: Lọc theo ID danh mục
 *       - in: query
 *         name: subcategory
 *         schema:
 *           type: string
 *           example: 64df82b98c75a8c30f7a12e5
 *         description: Lọc theo ID danh mục con
 *       - in: query
 *         name: colors
 *         schema:
 *           type: string
 *           example: Black
 *         description: Lọc theo màu sắc
 *       - in: query
 *         name: ratingAvg[gte]
 *         schema:
 *           type: number
 *           example: 4
 *         description: Lọc sản phẩm có đánh giá trung bình từ mức này trở lên
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalDocuments:
 *                   type: integer
 *                   example: 50
 *                 getAllProducts:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Product"
 *       404:
 *         description: Không tìm thấy sản phẩm nào
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No products found
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
 */
productRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin", "user"),
    uploadMultipleFiles(arrFields, "products"),
    normalizeColors,
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
 *           example: iphone-15
 *     responses:
 *       200:
 *         description: Product details by slug
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 product:
 *                   $ref: "#/components/schemas/Product"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
 */
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
 *           example: 64f0b1f2a2c123456789abcd
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 product:
 *                   $ref: "#/components/schemas/Product"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
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
 *           example: 64f0b1f2a2c123456789abcd
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: iPhone 15 Pro
 *               descripton:
 *                 type: string
 *                 example: Updated iPhone description
 *               imgCover:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Black", "Silver"]
 *               price:
 *                 type: number
 *                 example: 1099
 *               priceAfterDiscount:
 *                 type: number
 *                 example: 999
 *               quantity:
 *                 type: number
 *                 example: 60
 *               sold:
 *                 type: number
 *                 example: 15
 *               category:
 *                 type: string
 *                 example: 64df82b98c75a8c30f7a12e4
 *               subcategory:
 *                 type: string
 *                 example: 64df82b98c75a8c30f7a12e5
 *               ratingAvg:
 *                 type: number
 *                 example: 4.7
 *               ratingCount:
 *                 type: number
 *                 example: 150
 *     responses:
 *       201:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 updateProduct:
 *                   $ref: "#/components/schemas/Product"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
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
 *           example: 64f0b1f2a2c123456789abcd
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
productRouter
  .route("/:id")
  .get(validate(getSpecificProductValidation), product.getProductById)
  .put(
    protectedRoutes,
    allowedTo("admin"),
    uploadMultipleFiles(arrFields, "products"),
    normalizeColors,
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
 *           example: 64df82b98c75a8c30f7a12e4
 *     responses:
 *       200:
 *         description: List of products by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Product"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
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
 *           example: 64df82b98c75a8c30f7a12e5
 *     responses:
 *       200:
 *         description: List of products by subcategory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Product"
 *       404:
 *         description: SubCategory not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SubCategory not found
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
 */
productRouter.get("/subcategory/:subCategoryId", product.getProductsBySubCategory);

export default productRouter;