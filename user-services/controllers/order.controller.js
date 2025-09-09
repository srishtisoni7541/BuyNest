const productModel = require("../../admin-services/models/product.model");
const OrderModel = require("../models/Order.model");
const User = require("../models/User");

module.exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartItems, shippingDetails } = req.body; 
    console.log(shippingDetails);

    const products = Array.isArray(cartItems) ? cartItems : [cartItems];

    let finalProducts = [];
    let totalAmount = 0;

    for (let item of products) {
      const product = await productModel.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }

      totalAmount += product.price * item.quantity;

      finalProducts.push({
        productId: product._id,
        name: product.name,
        brand: product.brand,
        size: item.size || null,
        color: item.color || null,
        image: product.images[0],
        quantity: item.quantity,
        price: product.price,
      });
    }

    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const order = await OrderModel.create({
      userId,
      orderNumber,
      products: finalProducts,
      shippingAddress: {
        fullName: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
        addressLine: shippingDetails.apartment || shippingDetails.address?.street,
        city: shippingDetails.city,
        state: shippingDetails.state,
        country: shippingDetails.country,
        postalCode: shippingDetails.pincode || shippingDetails.address?.zip,
      },
      totalAmount,
      orderStatus: "processing",
    });

    await User.findByIdAndUpdate(userId, {
      $push: { orders: order._id },
    });

    return res
      .status(201)
      .json({ message: "Order created successfully", order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating order" });
  }
};


module.exports.getAllOrders = async (req, res) => {
  try {
     const userId = req.user._id;
    const orders = await OrderModel.find({userId}).populate("userId", "name email");
    // console.log(orders);
    return res.json({ orders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching orders" });
  }
};

module.exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await OrderModel.findById(orderId).populate(
      "userId",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json({ order });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching order" });
  }
};

module.exports.updateUserOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    const { shippingAddress, products } = req.body;

    const order = await OrderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized" });
    }

    if (["shipped", "delivered", "cancelled"].includes(order.orderStatus)) {
      return res
        .status(400)
        .json({ message: "This order cannot be updated anymore" });
    }

    if (shippingAddress) {
      order.shippingAddress = shippingAddress;
    }

    if (products && products.length > 0) {
      const productIds = products.map((p) => p.productId);
      const dbProducts = await productModel.find({ _id: { $in: productIds } });

      if (dbProducts.length !== productIds.length) {
        return res.status(404).json({ message: "Some products not found" });
      }

      let totalAmount = 0;
      const updatedProducts = products.map((item) => {
        const dbProduct = dbProducts.find(
          (p) => p._id.toString() === item.productId
        );
        totalAmount += dbProduct.price * item.quantity;

        return {
          productId: dbProduct._id,
          name: dbProduct.name,
          brand: dbProduct.brand,
          size: item.size || null,
          color: item.color || null,
          image: dbProduct.images[0],
          quantity: item.quantity,
          price: dbProduct.price,
        };
      });

      order.products = updatedProducts;
      order.totalAmount = totalAmount;
    }

    await order.save();

    return res.json({ message: "Order updated successfully", order });
  } catch (err) {
    console.error("Update Order Error:", err);
    return res.status(500).json({ message: "Error updating order" });
  }
};

module.exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await OrderModel.findOne({ _id: orderId, userId: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "processing") {
      return res
        .status(400)
        .json({ message: "Only processing orders can be cancelled" });
    }
    order.orderStatus = "cancelled";
    await order.save();

    return res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    return res.status(500).json({ message: "Error cancelling order" });
  }
};
