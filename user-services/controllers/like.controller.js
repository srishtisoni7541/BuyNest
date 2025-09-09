const productModel = require("../../admin-services/models/product.model");
const User = require("../models/User");

module.exports.LikedProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    console.log(productId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (user.likedProducts.includes(productId)) {
      return res.status(409).json({ message: "Product already liked" });
    }
    user.likedProducts.push(productId);
    product.liked = true;
    await user.save();
    await product.save();
    res.status(200).json({ message: "Product liked successfully" });
  } catch (error) {
    console.log(error);
    return res.json(error.message);
  }
};

module.exports.fetchAllLikedProducts = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate("likedProducts");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user.likedProducts);
};


module.exports.removeLikedProducts = async(req,res)=>{
  const userId = req.user._id;
  const user = await User.findById(userId);
  if(!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const {productId} = req.params;
  const product = await productModel.findById(productId);
  if(!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  user.likedProducts.pull(productId);
  product.liked = false;
  await user.save();
  await product.save();
  res.status(200).json({ message: "Product removed from liked successfully" });
}