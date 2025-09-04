import Product from "../models/Product.js";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";
import { ObjectId } from "mongodb";
import url from "url";

// ✅ Get products by category
export const getProductsByCategory = async (req, res) => {
  const { category_id } = req.params;

  // Validate the incoming category_id to ensure it's a valid ObjectId
  if (!ObjectId.isValid(category_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Category ID",
    });
  }

  try {
    const products = await Product.find({ category: new ObjectId(category_id) })
      .populate({
        path: "category",
        model: Category,
        select: "_id name description",
      })
      .sort({ createdAt: "desc" })
      .limit(8)
      .exec();

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
      });
    }

    res.status(200).json({
      success: true,
      message: "Found product records",
      data: products,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: "category",
        model: Category,
        select: "_id name description",
      })
      .sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Found product records",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error: " + error.message,
    });
  }
};

// ✅ Create product
export const createProduct = async (req, res) => {
  const { name, price, tag, oldprice, description, category } = req.body;

  // Basic validation to prevent server crashes on missing data
  if (!name || !price || !description || !category) {
    return res.status(400).json({
      success: false,
      message:
        "Required fields (name, price, description, category) are missing.",
    });
  }

  try {
    // Check for existing product with same name
    const existingProduct = await Product.findOne({ name: name.trim() });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: `A product with the name "${name}" already exists.`,
      });
    }

    // Get Cloudinary URLs from multer-storage-cloudinary
    const image = req.files?.image?.[0]?.path || null;
    const secondImage = req.files?.secondImage?.[0]?.path || null;

    const product = new Product({
      name: name.trim(),
      price,
      tag,
      oldprice,
      description,
      image,
      secondImage,
      category: new ObjectId(category),
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (err) {
    console.error("Error creating product:", err.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred: " + err.message,
    });
  }
};

// ✅ Get single product
export const getSingleProduct = async (req, res) => {
  const { product_id } = req.params;

  if (!product_id) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    });
  }

  try {
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `${product.name} product record found`,
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error: " + error.message,
    });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  const { product_id } = req.params;

  if (!product_id) {
    return res
      .status(400)
      .json({ success: false, message: "Product ID is required" });
  }

  try {
    const updateFields = {
      name: req.body.name,
      price: req.body.price,
      tag: req.body.tag,
      oldprice: req.body.oldprice,
      description: req.body.description,
      category: new ObjectId(req.body.category),
    };

    // Correctly get the file paths from req.files
    if (req.files?.image && req.files.image[0]) {
      updateFields.image = req.files.image[0].path;
    }

    if (req.files?.secondImage && req.files.secondImage[0]) {
      updateFields.secondImage = req.files.secondImage[0].path;
    }

    const product = await Product.findByIdAndUpdate(product_id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: `${product.name} updated successfully`,
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred: " + error.message,
    });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  const { product_id } = req.params;

  if (!product_id) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    });
  }

  try {
    const product = await Product.findByIdAndDelete(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `${product.name} deleted successfully`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product: " + error.message,
    });
  }
};

// ✅ Get wishlist
export const getWishlistProducts = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({
      success: false,
      message: "User ID is required!",
    });
  }

  try {
    const user = await User.findById(user_id)
      .select("-password")
      .populate({
        path: "wishlists",
        model: "Product",
        select: "_id image secondImage name price tag oldprice createdAt",
        options: { sort: { createdAt: -1 } },
        populate: [
          {
            path: "category",
            model: Category,
            select: "_id name description",
          },
        ],
      })
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Wishlist products retrieved successfully!",
      data: user.wishlists || [],
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching wishlist: " + error.message,
    });
  }
};

// ✅ Add/remove product to wishlist
export const addProductToWishlist = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required!",
      });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    if (!Array.isArray(user.wishlists)) {
      user.wishlists = [];
    }

    const index = user.wishlists.indexOf(product_id);

    if (index === -1) {
      user.wishlists.unshift(product_id);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Product added to wishlist!",
        data: user.wishlists,
      });
    } else {
      user.wishlists.splice(index, 1);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Product removed from wishlist!",
        data: user.wishlists,
      });
    }
  } catch (error) {
    console.error("Wishlist error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error updating wishlist: " + error.message,
    });
  }
};

export const getSearchProducts = async (req, res) => {
  try {
    const { q, limit = 100 } = req.query;

    if (!q || q.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tag: { $regex: q, $options: "i" } },
      ],
    })
      .limit(Number(limit))
      .exec();

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No product found" });
    }

    res.status(200).json({
      success: true,
      message: "Records found",
      products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



