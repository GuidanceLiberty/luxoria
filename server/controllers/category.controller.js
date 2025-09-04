import { Category } from "../models/Category.js";
import { categorySchema } from "../schemas/Index.js";
import { ObjectId } from "mongodb";

// ✅ Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: "desc" });
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No category records found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Create a category
export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  // Validate request body against Joi schema
  const { error } = categorySchema.validate({ name, description });
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    // Check if category already exists
    const categoryExist = await Category.findOne({ name });
    if (categoryExist) {
      return res.status(400).json({
        success: false,
        message: `${name} category already exists`,
      });
    }

    // Handle photo upload from multer-storage-cloudinary
    let photo = null;
    if (req.file) {
      photo = req.file.path; // Cloudinary URL is stored here
    }

    const category = new Category({ name, description, photo });
    await category.save();

    res.status(201).json({
      success: true,
      message: `${name} category added successfully`,
      data: category,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get a single category
export const getCategory = async (req, res) => {
  if (!ObjectId.isValid(req.params.category_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Category ID" });
  }
  const _id = new ObjectId(req.params.category_id);

  try {
    const category = await Category.findById(_id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Update category
export const updateCategory = async (req, res) => {
  if (!ObjectId.isValid(req.params.category_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Category ID" });
  }
  const category_id = new ObjectId(req.params.category_id);

  const { name, description } = req.body;

  // Validate the text fields
  const { error } = categorySchema.validate({ name, description });
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    let updateData = { name, description };

    // Handle Cloudinary photo update if a new photo is uploaded
    if (req.file) {
      updateData.photo = req.file.path; // Cloudinary URL is stored here
    }

    const category = await Category.findOneAndUpdate(
      { _id: category_id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: `${category?.name} updated successfully!`,
      data: category,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete category
export const deleteCategory = async (req, res) => {
  if (!ObjectId.isValid(req.params.category_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Category ID" });
  }
  const _id = new ObjectId(req.params.category_id);

  try {
    const category = await Category.findOneAndDelete({ _id });
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
