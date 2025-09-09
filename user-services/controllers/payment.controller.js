const Razorpay = require("razorpay");
const crypto = require("crypto");
const OrderModel = require("../models/Order.model");
const PaymentModel = require("../models/Payment.model");
console.log(process.env.RAZORPAY_KEY_ID);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const amountInPaise = Math.round(order.totalAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${order._id}`,
      notes: {
        orderId: order._id.toString(),
        userId: order.userId?.toString() || "",
      },
      payment_capture: 1,
    };

    const rpOrder = await razorpay.orders.create(options);

    // Payment model me save karo
    const payment = new PaymentModel({
      orderId: order._id,
      userId: order.userId,
      amount: order.totalAmount,
      currency: "INR",
      paymentProvider: "razorpay",
      razorpayOrderId: rpOrder.id,
      status: "pending",
    });
    await payment.save();

    return res.json({
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      paymentId: payment._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      paymentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
    // console.log(req.body);

    if (!paymentId || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const payment = await PaymentModel.findById(paymentId);
    console.log(payment);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (payment.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ message: "Order mismatch" });
    }

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    // console.log(body);
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Update Payment
    payment.status = "succeeded";
    payment.isPaid = true;
    payment.paidAt = new Date();
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    await payment.save();

    // Update Order
    const order = await OrderModel.findById(payment.orderId);
    // console.log(order);
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    await order.save();

    return res.json({
      success: true,
      message: "Payment verified",
      orderId: order._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Verification failed" });
  }
};
