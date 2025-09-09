const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "inr",
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },

    paymentProvider: {
      type: String,
      enum: ["razorpay", "stripe", "paypal"],
      default: "razorpay",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    isPaid: { type: Boolean, default: false },
    paidAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
