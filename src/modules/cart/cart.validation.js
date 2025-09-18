import Joi from "joi";

// ✅ Validation khi thêm sản phẩm vào giỏ hàng
export const addProductToCartValidation = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    "any.required": "productId is required",
    "string.hex": "productId must be a valid ObjectId",
    "string.length": "productId must be 24 characters",
  }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.base": "quantity must be a number",
    "number.min": "quantity must be at least 1",
  }),
  color: Joi.string().required().messages({
    "any.required": "color is required",
  }),
});

// ✅ Validation khi xoá sản phẩm khỏi giỏ hàng
export const removeProductFromCartValidation = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "any.required": "id is required",
    "string.hex": "id must be a valid ObjectId",
    "string.length": "id must be 24 characters",
  }),
});
