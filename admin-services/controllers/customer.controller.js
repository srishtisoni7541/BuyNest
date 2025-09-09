const OrderModel = require("../../user-services/models/Order.model");
const User = require("../../user-services/models/User");
const redis = require("../../utils/Redis");

module.exports.DeleteUserById = async (req, res) => {
  const { id } = req.params;
//   console.log("Deleting user:", id);

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await OrderModel.deleteMany({ userId: id });

    const cacheKey = `orders:${id}`;
    await redis.del(cacheKey);

    return res.status(200).json({
      message: "User, associated orders, and Redis cache deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: error.message });
  }
};




module.exports.FindAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // console.log(users);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};