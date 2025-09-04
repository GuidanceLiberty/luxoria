import express from "express";
import {
  addProductToWishlist,
  createProduct,
  deleteProduct,
  getProducts,
  getProductsByCategory,
  getSearchProducts,
  getSingleProduct,
  getWishlistProducts,
  updateProduct,
} from "../controllers/productController.js";

import upload from "../middleware/upload.js"; // ✅ uses Cloudinary storage

const router = express.Router();

router.get("/category/:category_id", getProductsByCategory);

router.get("/", getProducts);

router.get("/single-product/:product_id", getSingleProduct);

router.delete("/:product_id", deleteProduct);

router.get("/wishlist/:user_id", getWishlistProducts);
router.post("/wishlist", addProductToWishlist);

// ✅ Create product (with Cloudinary image uploads)
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "secondImage", maxCount: 1 },
  ]),
  createProduct
);

// ✅ Update product (with Cloudinary image uploads)
router.put(
  "/:product_id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "secondImage", maxCount: 1 },
  ]),
  updateProduct
);


router.get('/search', getSearchProducts);
export default router;
