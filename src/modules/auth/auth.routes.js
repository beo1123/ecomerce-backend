import express from "express";
import * as auth from "./auth.controller.js";

const authRouter = express.Router();

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mySecret123
 *     responses:
 *       201:
 *         description: User created successfully + JWT token
 *       409:
 *         description: Account is already exist
 */
authRouter.post("/signup", auth.signUp);

/**
 * @openapi
 * /api/v1/auth/signin:
 *   post:
 *     summary: Đăng nhập
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: mySecret123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công (trả về JWT token)
 *       401:
 *         description: Invalid email or password
 */
authRouter.post("/signin", auth.signIn);

export default authRouter;
