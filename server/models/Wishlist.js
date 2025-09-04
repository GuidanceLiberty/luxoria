import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
 
  image: { type: String },
  secondImage: { type: String },
  name: { type: String, unique: true, required: true },
  price: { type: String, required: true },
  tag: { type: String, default: null },
  oldprice: { type: String, default: null },
  
});

const Wishlist = mongoose.model("Wishlists", wishlistSchema);

export default Wishlist;
