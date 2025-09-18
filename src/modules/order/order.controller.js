import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { cartModel } from "../../../Database/models/cart.model.js";
import { productModel } from "../../../Database/models/product.model.js";
import { orderModel } from "../../../Database/models/order.model.js";

/**
 * Tạo đơn hàng COD
 */
const createCashOrder = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError("Cart not found", 404));

  const totalOrderPrice = cart.totalPriceAfterDiscount ?? cart.totalPrice;

  const order = new orderModel({
    userId: req.user._id,
    cartItems: cart.cartItem,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: "cash",
    totalOrderPrice,
  });

  await order.save();

  // Update số lượng sản phẩm
  const options = cart.cartItem.map((item) => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
    },
  }));
  await productModel.bulkWrite(options);

  await cartModel.findByIdAndDelete(req.params.id);

  res.status(201).json({ message: "Order created successfully", order });
});

/**
 * Lấy đơn hàng của user hiện tại
 */
const getUserOrders = catchAsyncError(async (req, res) => {
  const orders = await orderModel.find({ userId: req.user._id }).populate("cartItems.productId");
  res.status(200).json({ message: "Success", orders });
});

/**
 * Lấy tất cả đơn hàng (dành cho admin)
 */
const getAllOrders = catchAsyncError(async (req, res) => {
  const orders = await orderModel.find({}).populate("cartItems.productId");
  res.status(200).json({ message: "Success", orders });
});

/**
 * Cập nhật trạng thái đơn hàng
 */
const updateOrder = catchAsyncError(async (req, res, next) => {
  const { orderId } = req.params;
  const { isPaid, isDelivered } = req.body;

  const order = await orderModel.findById(orderId);
  if (!order) return next(new AppError("Order not found", 404));

  if (typeof isPaid === "boolean") {
    order.isPaid = isPaid;
    if (isPaid) order.paidAt = Date.now();
  }

  if (typeof isDelivered === "boolean") {
    order.isDelivered = isDelivered;
    if (isDelivered) order.deliveredAt = Date.now();
  }

  await order.save();
  res.status(200).json({ message: "Order updated successfully", order });
});

export {
  createCashOrder,
  getUserOrders,
  getAllOrders,
  updateOrder,
};
