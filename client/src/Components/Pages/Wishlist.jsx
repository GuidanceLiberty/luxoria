import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:6060/api";
const IMAGE_BASE =
  import.meta.env.VITE_IMAGE_URL || API_URL.replace("/api", "");

const getImageUrl = (path) => {
  if (!path) return "/images/placeholder.jpg";
  return path.startsWith("http") ? path : `${IMAGE_BASE}${path}`;
};

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast.error("Item removed from Wishlist");
  };

  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    const alreadyInCart = existing.find((p) => p._id === product._id);

    if (!alreadyInCart) {
      const updatedProduct = { ...product, quantity: 1 };
      const updatedCart = [...existing, updatedProduct];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.name} added to Your cart`);
    } else {
      toast.info(`${product.name} is already in your cart!`);
    }
  };

  const addToWishlist = (product) => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (existingWishlist.some((item) => item._id === product._id)) {
      toast.info(`${product.name} is already in your Wishlist`);
      return;
    }
    const updatedWishlist = [...existingWishlist, product];
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast.success(`${product.name} added to your Wishlist!`);
  };

  return (
    <>
      <nav aria-label="breadcrumb" className="section-banner py-3">
        <ol className="breadcrumb container mb-0">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Home</Link>
          </li>
          <li className="breadcrumb-item active">Wishlist</li>
        </ol>
      </nav>

      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4">❤️ Your Wishlist</h2>

        {wishlist.length === 0 ? (
          <div className="text-center">
            <p className="lead text-muted">Your wishlist is Empty.</p>
            <Link to="/shop" className="btn btn-primary">
              <i className="bi bi-bag me-2"></i>Browse Products
            </Link>
          </div>
        ) : (
          <div className="row">
            {wishlist.map((product) => (
              <div className="col-md-3 mb-4" key={product._id}>
                <div className="product-item mb-5 text-center position-relative">
                  <div className="product-image w-100 position-relative overflow-hidden">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="img-fluid"
                    />
                    {product.secondImage && (
                      <img
                        src={getImageUrl(product.secondImage)}
                        alt={product.name}
                        className="img-fluid mt-2"
                      />
                    )}
                    <div className="product-icons gap-3 d-flex justify-content-center mt-2">
                      <Link
                        to={`/product/${product._id}`}
                        className="product-icon d-flex"
                        title="View Product"
                      >
                        <i className="bi bi-eye fs-5"></i>
                      </Link>
                      <div
                        className="product-icon d-flex"
                        title="Add to Cart"
                        onClick={() => addToCart(product)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="bi bi-cart3 fs-5"></i>
                      </div>
                      <div
                        className="product-icon d-flex"
                        title="Remove from Wishlist"
                        onClick={() => removeFromWishlist(product._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="bi bi-trash fs-5"></i>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/product/${product._id}`}
                    className="text-decoration-none text-black"
                  >
                    <div className="product-content pt-3">
                      {product.oldprice ? (
                        <div className="price">
                          <span className="text-muted text-decoration-line-through me-2">
                            ₦{product.oldprice}
                          </span>
                          <span className="fw-bold text-muted">₦{product.price}</span>
                        </div>
                      ) : (
                        <span className="price fw-bold">₦{product.price}</span>
                      )}
                      <h3 className="title pt-1">{product.name}</h3>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default Wishlist;
