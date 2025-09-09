const productModel = require("../models/product.model");
const redis = require("../../utils/Redis");
const categoryModel = require("../models/category.model");
const { default: mongoose } = require("mongoose");

module.exports.CreateProduct = async (req, res) => {
  let { title, description, price,brand, stock, category, attributes } = req.body;
  console.log(req.body);

  try {
    const catDoc = await categoryModel.findOne({ name: category });
    if (!catDoc)
      return res.status(400).json({ message: "Category not found!" });

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    }
    // console.log("Uploaded images:", imageUrls);

    const newProduct = await productModel.create({
      title,
      description,
      price,
      stock,
      category: catDoc._id,
      images: imageUrls,
      brand,
      attributes: {
        subCategory: req.body.subCategory || "",
        colors: req.body.colors || [],
        sizes: req.body.sizes || [],
      },
    });

    await newProduct.save();
    await redis.del("allProducts");

    return res.json({
      message: "Product created successfully!",
      newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.FindAllProducts = async (req, res) => {
  try {
    const cacheData = await redis.get("allProducts");
    if (cacheData) {
      console.log("📦 Serving products from Redis cache");
      return res.json({
        message: "All products fetched successfully! (from cache)",
        allProducts: JSON.parse(cacheData),
      });
    }

    const allProducts = await productModel.find().populate("category", "name");

    await redis.set("allProducts", JSON.stringify(allProducts), "EX", 60);

    console.log(" Serving products from DB");
    return res.json({
      message: "All products fetched successfully! (from DB)",
      allProducts,
    });
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports.FindById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findOne({ _id: id });
    if (!product) {
      return res.json({ message: "Product not found!" });
    }
    return res.json({ message: "Product fetched successfully!", product });
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports.updateById = async (req, res) => {
  const { id } = req.params;
  const { title, category, price, stock, description, attributes } = req.body;

  try {
    const product = await productModel.findById(id);
    if (!product)
      return res.status(404).json({ message: "Product not found!" });

    let categoryId = product.category;

    if (category) {
      const foundCategory =
        typeof category === "string"
          ? await categoryModel.findOne({ name: category })
          : category.name
          ? await categoryModel.findOne({ name: category.name })
          : null;

      if (!foundCategory) {
        return res.status(400).json({ message: "Category not found!" });
      }
      categoryId = foundCategory._id;
    }

    // Prepare update object
    const updateData = {
      title: title || product.title,
      category: categoryId,
      price: price !== undefined ? price : product.price,
      stock: stock !== undefined ? stock : product.stock,
      description: description || product.description,
      attributes: attributes || product.attributes, // dynamic fields
    };

    // Images
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => file.path);
      updateData.images = imagePaths;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    await redis.del("allProducts");

    return res.json({
      message: "Product updated successfully!",
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.DeleteById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findOne({ _id: id });
    if (!product) {
      return res.json({ message: "Product not found!" });
    }
    await productModel.deleteOne({ _id: id });

    await redis.del("allProducts");

    return res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    return res.json(error.message);
  }
};
