import express from "express";
import * as User from "./user.controller.js";
import { validate } from "../../middlewares/validate.js";
import {
  addUserValidation,
  changeUserPasswordValidation,
  deleteUserValidation,
  updateUserValidation,
} from "./user.validation.js";

const userRouter = express.Router();

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
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
userRouter.post("/", validate(addUserValidation), User.addUser);

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Lấy tất cả người dùng (có hỗ trợ filter, search, sort, pagination)
 *     tags:
 *       - User
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
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: -createdAt
 *     responses:
 *       200:
 *         description: Danh sách tất cả user
 */
userRouter.get("/", User.getAllUsers);

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
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: User cập nhật thành công
 *       404:
 *         description: User không tồn tại
 */
userRouter.put("/:id", validate(updateUserValidation), User.updateUser);

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
 *     responses:
 *       200:
 *         description: User xóa thành công
 *       404:
 *         description: User không tồn tại
 */
userRouter.delete("/:id", validate(deleteUserValidation), User.deleteUser);

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
 *                 example: newSecret456
 *     responses:
 *       200:
 *         description: Mật khẩu được cập nhật thành công
 *       404:
 *         description: User không tồn tại
 */
userRouter.patch(
  "/:id/password",
  validate(changeUserPasswordValidation),
  User.changeUserPassword
);

export default userRouter;
