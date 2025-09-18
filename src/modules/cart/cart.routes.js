import express from "express";
import * as cart from "./cart.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
    addProductToCartValidation,
    removeProductFromCartValidation,
} from "./cart.validation.js";
import { protectedRoutes, allowedTo } from "../auth/auth.controller.js";

const cartRouter = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "650f82b98c75a8c30f7a12e9"
 *         productId:
 *           type: string
 *           example: "650f82b98c75a8c30f7a12e4"
 *         quantity:
 *           type: integer
 *           example: 2
 *         color:
 *           type: string
 *           example: "Black"
 *         price:
 *           type: number
 *           example: 999
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         cartItem:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         totalPrice:
 *           type: number
 *           example: 1998
 *         totalPriceAfterDiscount:
 *           type: number
 *           example: 1798
 *         discount:
 *           type: number
 *           example: 10
 */

/**
 * @openapi
 * /api/v1/carts:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "650f82b98c75a8c30f7a12e4"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               color:
 *                 type: string
 *                 example: "Silver"
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 result:
 *                   $ref: '#/components/schemas/Cart'
 *   get:
 *     summary: Lấy giỏ hàng của user đang đăng nhập
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Giỏ hàng hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 */
cartRouter
    .route("/")
    .post(protectedRoutes, validate(addProductToCartValidation), cart.addProductToCart)
    .get(protectedRoutes, cart.getLoggedUserCart);

/**
 * @openapi
 * /api/v1/carts/{id}:
 *   put:
 *     summary: Cập nhật số lượng sản phẩm trong giỏ hàng
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "650f82b98c75a8c30f7a12e4"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Cart updated successfully
 *   delete:
 *     summary: Xoá sản phẩm khỏi giỏ hàng theo ID item trong cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "650f82b98c75a8c30f7a12e9"
 *     responses:
 *       200:
 *         description: Item removed successfully
 */
cartRouter
    .route("/:id")
    .put(protectedRoutes, cart.updateProductQuantity)
    .delete(protectedRoutes, validate(removeProductFromCartValidation), cart.removeProductFromCart);

/**
 * @openapi
 * /api/v1/carts/applyCoupon:
 *   post:
 *     summary: Áp dụng mã giảm giá vào giỏ hàng
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SALE10"
 *     responses:
 *       201:
 *         description: Coupon applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 */
cartRouter.post("/applyCoupon", protectedRoutes, cart.applyCoupon);

export default cartRouter;
