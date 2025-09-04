import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  image: { type: String, default: null },
  secondImage: { type: String, default: null },
  name: { type: String, unique: true, required: true },
  price: { type: String, required: true },
  tag: { type: String, default: null },
  oldprice: { type: String, default: null },
  wishlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null }, // ✅ single category
});

const Product = mongoose.model("Product", productSchema);

export default Product;
