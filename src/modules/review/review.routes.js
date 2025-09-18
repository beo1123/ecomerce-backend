import express from "express";
import * as review from "./review.controller.js";
import { validate } from "../../middlewares/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
  addReviewValidation,
  deleteReviewValidation,
  getSpecificReviewValidation,
  updateReviewValidation,
} from "./review.validation.js";

const reviewRouter = express.Router();

/**
 * @openapi
 * /api/v1/review:
 *   post:
 *     summary: Thêm review mới
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - text
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64f0b1f2a2c123456789abcd
 *               text:
 *                 type: string
 *                 example: Sản phẩm rất tốt, chất lượng vượt mong đợi!
 *               rate:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Review được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Người dùng đã review sản phẩm này
 */
reviewRouter.post(
  "/",
  protectedRoutes,
  allowedTo("user"),
  validate(addReviewValidation),
  review.addReview
);

/**
 * @openapi
 * /api/v1/review:
 *   get:
 *     summary: Lấy tất cả review
 *     tags:
 *       - Review
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Danh sách review
 */
reviewRouter.get("/", review.getAllReviews);

/**
 * @openapi
 * /api/v1/review/{id}:
 *   get:
 *     summary: Lấy review theo ID
 *     tags:
 *       - Review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f0b1f2a2c123456789abcd
 *     responses:
 *       200:
 *         description: Review được tìm thấy
 *       404:
 *         description: Review không tồn tại
 */
reviewRouter.get(
  "/:id",
  validate(getSpecificReviewValidation),
  review.getSpecificReview
);

/**
 * @openapi
 * /api/v1/review/{id}:
 *   put:
 *     summary: Cập nhật review theo ID
 *     tags:
 *       - Review
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
 *               text:
 *                 type: string
 *                 example: Mình đã cập nhật review, sản phẩm dùng ổn
 *               rate:
 *                 type: number
 *                 example: 4
 *     responses:
 *       200:
 *         description: Review cập nhật thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: Review không tồn tại
 */
reviewRouter.put(
  "/:id",
  protectedRoutes,
  allowedTo("user"),
  validate(updateReviewValidation),
  review.updateReview
);

/**
 * @openapi
 * /api/v1/review/{id}:
 *   delete:
 *     summary: Xóa review theo ID
 *     tags:
 *       - Review
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
 *         description: Review xóa thành công
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: Review không tồn tại
 */
reviewRouter.delete(
  "/:id",
  protectedRoutes,
  allowedTo("admin", "user"),
  validate(deleteReviewValidation),
  review.deleteReview
);

export default reviewRouter;
