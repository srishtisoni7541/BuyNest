const productModel = require("../../admin-services/models/product.model");
const User = require("../models/User");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "ProductId and quantity required" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    res.status(200).json({
      message: "Product added to cart",
      cart: user.cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
exports.findAllCart = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log(userId);
    const user = await User.findById(userId).populate("cart.productId");
    // console.log(user);
    res.status(200).json({
      message: "Cart fetched successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log(userId);
    const { productId } = req.params;
    // console.log(productId);

    const user = await User.findById(userId).populate("cart.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter((item) => {
      if (!item.productId) return false; 
      const id = item.productId._id
        ? item.productId._id.toString()
        : item.productId.toString();
      return id !== productId;
    });

    await user.save();

    res.status(200).json({
      message: "Item removed from cart successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { quantity } = req.body;
    console.log(req.body);
    const { productId } = req.params;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const user = await User.findById(userId).populate("cart.productId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingItem = user.cart.find(
      (item) => item.productId._id.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    await user.populate("cart.productId");

    res
      .status(200)
      .json({ message: "Cart updated successfully", cart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
