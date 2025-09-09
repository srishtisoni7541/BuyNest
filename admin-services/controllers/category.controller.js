



const redis = require("../../utils/Redis");
const categoryModel = require("../models/category.model");

module.exports.CreateCategory = async (req, res) => {
  const { name, description } = req.body;
  // console.log(req.body);
  try {
    const category = await categoryModel.findOne({ name });
    if (category) {
      return res.json({ message: "category already exists !" });
    }

    const newCategory = await categoryModel.create({ name, description });
    // console.log(newCategory);

    await redis.del("allCategories");

    return res.json({
      message: "category created successfully!",
      newCategory,
    });
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports.GetAllCategories = async (req, res) => {
  try {
    const cacheData = await redis.get("allCategories");
    if (cacheData) {
      console.log(" Serving categories from Redis cache");
      return res.status(200).json({
        message: "all category fetched successfully! (from cache)",
        data: JSON.parse(cacheData),
      });
    }

    // 2️ DB fetch
    const categories = await categoryModel.find();

    // 3️ Save to cache (120 sec expiry)
    await redis.set("allCategories", JSON.stringify(categories), "EX", 120);

    console.log("💾 Serving categories from DB");
    return res.status(200).json({
      message: "all category fetched successfully! (from DB)",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.findById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryModel.findOne({ _id: id });
    if (!category) {
      return res.json({ message: "category not found !" });
    }

    return res.json({
      message: "category fetched successfully!",
      category,
    });
  } catch (error) {
    return res.json({ message: "something went wrong !", error });
  }
};

module.exports.updateById = async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found!",
      });
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    //  Cache clear after update
    await redis.del("allCategories");

    return res.status(200).json({
      success: true,
      message: "Category updated successfully!",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

module.exports.DeleteById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryModel.findOne({ _id: id });
    if (!category) {
      return res.json({ message: "category not found !" });
    }

    await categoryModel.deleteOne({ _id: id });

    //  Cache clear after delete
    await redis.del("allCategories");

    return res.json({ message: "category deleted successfully!" });
  } catch (error) {
    return res.json(error);
  }
};
