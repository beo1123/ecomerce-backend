import { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        cartItems: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "product" },
                quantity: { type: Number, default: 1 },
                price: { type: Number, required: true },
                totalProductDiscount: { type: Number, default: 0 },
            },
        ],
        shippingAddress: {
            street: String,
            city: String,
            phone: Number,
        },
        paymentMethod: {
            type: String,
            enum: ["card", "cash"],
            default: "cash",
        },
        isPaid: { type: Boolean, default: false },
        isDelivered: { type: Boolean, default: false },
        paidAt: Date,
        deliveredAt: Date,
        totalOrderPrice: { type: Number, required: true },
    },
    { timestamps: true }
);

export const orderModel = model("order", orderSchema);
