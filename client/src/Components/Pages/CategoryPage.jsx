import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BASE_URL || "http://localhost:6060/api";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);

        const allCategoriesRes = await axios.get(`${API}/categories`);
        const categories = allCategoriesRes.data?.data;

        if (!Array.isArray(categories)) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const foundCategory = categories.find(
          (cat) =>
            cat &&
            cat.name &&
            cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (!foundCategory) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const productsRes = await axios.get(
          `${API}/products/category/${foundCategory._id}`
        );

        setProducts(productsRes.data.data);
      } catch (err) {
        console.error("Error fetching products by category:", err);
        toast.error("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [categoryName, API]);

  const addToWishlist = (product) => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!existing.some((p) => p._id === product._id)) {
      const updated = [...existing, product];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlistUpdated"));
      toast.success(`${product.name} added to Your wishlist`);
    } else {
      toast.info(`${product.name} is already in your wishlist`);
    }
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

  const getImageUrl = (path) => {
    const API_URL =
      import.meta.env.VITE_BASE_URL || "http://localhost:6060/api";
    if (!path) return "/images/placeholder.jpg";
    return path.startsWith("http")
      ? path
      : `${API_URL.replace("/api", "")}${path}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Home</Link>
        </li>
        <li className="position-relative active">
          <span className="ps-5">{categoryName} Products</span>
        </li>
      </ol>

      <div className="shop-container">
        <div className="container-fluid px-3 px-md-5">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h1 className="py-4 fw-semibold mb-0 text-capitalize">
              {categoryName}
            </h1>
          </div>

          <div className="row g-4">
            {products.length === 0 ? (
              <p className="text-center">No products found in this category.</p>
            ) : (
              products.map((product) => (
                <div
                  className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4"
                  key={product._id}
                >
                  <div className="product-item mb-5 text-center position-relative">
                    <div className="product-image w-100 position-relative overflow-hidden">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                      />
                      {product.secondImage && (
                        <img
                          src={getImageUrl(product.secondImage)}
                          alt={product.name}
                          className="img-fluid"
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                          }}
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
                          title="Add to Wishlist"
                          onClick={() => addToWishlist(product)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="bi bi-heart fs-5"></i>
                        </div>
                        <div
                          className="product-icon d-flex"
                          title="Add to Cart"
                          onClick={() => addToCart(product)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="bi bi-cart3 fs-5"></i>
                        </div>
                      </div>

                      {product.tag && (
                        <span
                          className={`tag badge text-white ${
                            product.tag === "New" ? "bg-danger" : "bg-success"
                          }`}
                        >
                          {product.tag}
                        </span>
                      )}
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
                            <span className="fw-bold text-muted">
                              ₦{product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="price fw-bold">
                            ₦{product.price}
                          </span>
                        )}
                        <h3 className="title pt-1">{product.name}</h3>
                      </div>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default CategoryPage;
