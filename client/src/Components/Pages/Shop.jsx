/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Shop = () => {
  const [filterSortOption, setFilterSortOption] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  // ✅ NEW: Log the user object to see what the component is receiving
  console.log("Current user from useAuth:", user);
  console.log(
    "Current user from localStorage:",
    JSON.parse(localStorage.getItem("user"))
  );

  const API_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        const result = await response.json();

        if (result.success) {
          setProducts(result.data);
        } else {
          toast.error(result.message || "Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

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

  const handleFilterSort = () => {
    let filtered = [...products];
    if (filterSortOption === "New" || filterSortOption === "Sale") {
      filtered = filtered.filter((product) => product.tag === filterSortOption);
    }
    if (filterSortOption === "low") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
    if (filterSortOption === "high") {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const displayedProducts = handleFilterSort();

  const getImageUrl = (path) => {
    if (!path) return "/images/placeholder.jpg";
    return path.startsWith("http")
      ? path
      : `${API_URL.replace("/api", "")}${path}`;
  };

  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Home</Link>
        </li>
        <li className="position-relative active">
          <span className="ps-5">Products</span>
        </li>
      </ol>

      <div className="shop-container">
        <div className="container-fluid px-3 px-md-5">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h1 className="py-4 fw-semibold mb-0">Products</h1>
            {user && user.role === "admin" && (
              <button
                className="btn btn-dark"
                onClick={() => navigate("/create-product")}
              >
                <FaPlus className="me-2" />
                Create Product
              </button>
            )}
          </div>
          <div className="containr my-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="text-muted" style={{ fontSize: "1.1rem" }}>
                {loading ? (
                  "Loading products..."
                ) : (
                  <>
                    Showing <strong>{displayedProducts.length}</strong> product
                    {displayedProducts.length !== 1 && "s"} for "
                    {filterSortOption === "all"
                      ? "All"
                      : filterSortOption.charAt(0).toUpperCase() +
                        filterSortOption.slice(1)}{" "}
                    "
                  </>
                )}
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="form-control py-2 fs-6"
                style={{ width: "min(100%, 280px)" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="d-inline-block">
                <select
                  className="form-select py-2 fs-6"
                  style={{
                    width: "auto",
                    display: "inline-block",
                    backgroundColor: "#f5f5f5",
                    border: "0px",
                  }}
                  value={filterSortOption}
                  onChange={(e) => setFilterSortOption(e.target.value)}
                >
                  <option value="all">All Products</option>
                  <option value="New">New Products</option>
                  <option value="Sale">Sale Products</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row g-4">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : displayedProducts.length === 0 ? (
              <p className="text-center">No products found.</p>
            ) : (
              displayedProducts.map((product) => (
                <div
                  className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4"
                  key={product._id}
                >
                  <div className="product-item mb-5 text-center position-relative">
                    <div className="product-image w-100 position-relative overflow-hidden">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="img-fluid product-img"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {product.secondImage && (
                        <img
                          src={getImageUrl(product.secondImage)}
                          alt={product.name}
                          className="img-fluid product-img"
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

export default Shop;
