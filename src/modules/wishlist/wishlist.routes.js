import express from "express";
import { validate } from "../../middlewares/validate.js";
import {
  addToWishListValidation,
  deleteFromWishListValidation,
} from "./wishlist.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import * as wishlist from "../wishlist/wishlist.controller.js";

const wishListRouter = express.Router();

/**
 * @openapi
 * /api/v1/wishlist:
 *   patch:
 *     summary: Thêm sản phẩm vào wishlist của user
 *     tags:
 *       - Wishlist
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
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64f0b1f2a2c123456789abcd
 *     responses:
 *       201:
 *         description: Thêm sản phẩm vào wishlist thành công
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: User hoặc wishlist không tồn tại
 */
wishListRouter.patch(
  "/",
  protectedRoutes,
  allowedTo("user"),
  validate(addToWishListValidation),
  wishlist.addToWishList
);

/**
 * @openapi
 * /api/v1/wishlist:
 *   delete:
 *     summary: Xóa sản phẩm khỏi wishlist của user
 *     tags:
 *       - Wishlist
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
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64f0b1f2a2c123456789abcd
 *     responses:
 *       200:
 *         description: Xóa sản phẩm khỏi wishlist thành công
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: User hoặc wishlist không tồn tại
 */
wishListRouter.delete(
  "/",
  protectedRoutes,
  allowedTo("user"),
  validate(deleteFromWishListValidation),
  wishlist.removeFromWishList
);

/**
 * @openapi
 * /api/v1/wishlist:
 *   get:
 *     summary: Lấy tất cả sản phẩm trong wishlist của user
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách sản phẩm trong wishlist
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Không đủ quyền
 *       404:
 *         description: Wishlist không tồn tại
 */
wishListRouter.get(
  "/",
  protectedRoutes,
  allowedTo("user"),
  wishlist.getAllUserWishList
);

export default wishListRouter;
