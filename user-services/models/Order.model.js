const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderNumber: {
      type: String,
      unique: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        brand: String,
        size: String,
        color: String,
        image: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      fullName: String,
      addressLine: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded","confirmed"],
      default: "pending",
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered","confirmed", "cancelled"],
      default: "processing",
    },

    trackingNumber: {
      type: String,
    },

    estimatedDelivery: {
      type: Date,
    },

    actualDelivery: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
