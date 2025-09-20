import express from "express";
import { validate } from "../../middlewares/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import * as User from "./user.controller.js";
import {
  addUserValidation,
  changeUserPasswordValidation,
  deleteUserValidation,
  updateUserValidation,
} from "./user.validation.js";

const userRouter = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f0b1f2a2c123456789abcd
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           example: user
 *         isActive:
 *           type: boolean
 *           example: true
 *         verified:
 *           type: boolean
 *           example: false
 *         blocked:
 *           type: boolean
 *           example: false
 *         wishlist:
 *           type: array
 *           items:
 *             type: string
 *             example: 64f0b1f2a2c123456789abcd
 *         addresses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *                 example: Hanoi
 *               street:
 *                 type: string
 *                 example: 123 Main Street
 *               phone:
 *                 type: string
 *                 example: +84912345678
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         passwordChangedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *     Address:
 *       type: object
 *       properties:
 *         city:
 *           type: string
 *           example: Hanoi
 *         street:
 *           type: string
 *           example: 123 Main Street
 *         phone:
 *           type: string
 *           example: +84912345678
 */

/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     summary: Thêm người dùng mới
 *     tags:
 *       - User
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
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               verified:
 *                 type: boolean
 *                 example: false
 *               blocked:
 *                 type: boolean
 *                 example: false              
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 addUser:
 *                   $ref: "#/components/schemas/User"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error
 *       500:
 *         description: Server error
 */
userRouter.post("/", protectedRoutes, allowedTo("admin"), validate(addUserValidation), User.addUser);

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Lấy tất cả người dùng với filter, search, sort, pagination và field selection
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *         description: "Số trang hiện tại (mặc định 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           example: 10
 *         description: "Số lượng user mỗi trang (mặc định 10, tối đa 100)"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: -createdAt
 *         description: "Sắp xếp theo field, dùng '-' để sort giảm dần. Ví dụ: name,-createdAt hoặc -createdAt (mặc định)"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *           example: name,email,role
 *         description: "Chọn các field cụ thể để trả về, cách nhau bởi dấu phẩy. Ví dụ: name,email"
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: john
 *         description: "Tìm kiếm theo từ khóa trong name, email"
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *           example: admin
 *         description: "Lọc theo vai trò user"
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         description: "Lọc theo email chính xác"
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: John
 *         description: "Lọc theo tên (hỗ trợ regex)"
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *           example: true
 *         description: "Lọc theo trạng thái hoạt động"
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *           example: false
 *         description: "Lọc theo trạng thái xác thực"
 *       - in: query
 *         name: blocked
 *         schema:
 *           type: boolean
 *           example: false
 *         description: "Lọc theo trạng thái bị chặn"
 *     
 *     responses:
 *       200:
 *         description: Lấy danh sách user thành công
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
 *                   example: success
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/User"
 *       404:
 *         description: Không tìm thấy user nào
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No users found
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
 */
userRouter.get("/", protectedRoutes, allowedTo("admin"), User.getAllUsers);

/**
 * @openapi
 * /api/v1/users/profile:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại dựa trên token
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin user thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *       401:
 *         description: Token không hợp lệ hoặc không được cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired token
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *       404:
 *         description: User không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
 */
userRouter.get("/profile", protectedRoutes, allowedTo("admin", "user"), User.getUserByToken);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   put:
 *     summary: Cập nhật thông tin user theo ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f0b1f2a2c123456789abcd
 *         description: "ObjectId của user"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johnupdated@example.com
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: admin
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               verified:
 *                 type: boolean
 *                 example: false
 *               blocked:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: User cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 updateUser:
 *                   $ref: "#/components/schemas/User"
 *       404:
 *         description: User không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User was not found
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
userRouter.put("/:id", protectedRoutes, allowedTo("admin"), validate(updateUserValidation), User.updateUser);

/**
 * @openapi
 * /api/v1/users/{id}/password:
 *   patch:
 *     summary: Thay đổi mật khẩu user theo ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f0b1f2a2c123456789abcd
 *         description: "ObjectId của user"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newPassword123
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Mật khẩu thay đổi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 changeUserPassword:
 *                   $ref: "#/components/schemas/User"
 *       404:
 *         description: User không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User was not found
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
userRouter.patch("/:id/password", 
  protectedRoutes,
  allowedTo("admin", "user"), 
  validate(changeUserPasswordValidation), User.changeUserPassword);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Xóa user theo ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 64f0b1f2a2c123456789abcd
 *         description: "ObjectId của user"
 *     responses:
 *       200:
 *         description: User xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       404:
 *         description: User không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User was not found
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Server error
 */
userRouter.delete("/:id", protectedRoutes, allowedTo("admin",), validate(deleteUserValidation), User.deleteUser);

export default userRouter;