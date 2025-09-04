import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    photo: { type: String }, // optional, no default null
  },
  { timestamps: true }
);

// ⚠️ Removed duplicate schema.index to prevent warning

export const Category = mongoose.model("Category", categorySchema);
