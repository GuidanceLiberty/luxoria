import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from "./Spinner";

const Shop = () => {
  const navigate = useNavigate();
  // State to hold the products and manage loading status
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSortOption, setFilterSortOption] = useState("all");
  const API_URL = import.meta.env.VITE_BASE_URL 
  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

  // Function to fetch all products from the backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products from the server.");
    } finally {
      setLoading(false);
    }
  };

  // Use a useEffect hook to call fetchProducts when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array means this runs only once on mount

  // Function to add a product to the wishlist in localStorage
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

  // Function to add a product to the cart in localStorage
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

  // Function to handle product deletion with a confirmation and axios
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${API_URL}/products/${id}`);
      toast.success(res.data.message || "✅ Product deleted successfully!");
      // Call the local fetchProducts function to refresh the list
      fetchProducts();
    } catch (err) {
      console.error("❌ Error deleting product:", err.response?.data || err);
      toast.error("❌ Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle navigation to the update page
  const handleEdit = (product) => {
    navigate(`/update-product/${product._id}`);
  };

  // Function to filter and sort products based on the selected option
  const handleFilterSort = () => {
    let filtered = Array.isArray(products) ? [...products] : [];

    if (filterSortOption === "New" || filterSortOption === "Sale") {
      filtered = filtered.filter((product) => product.tag === filterSortOption);
    }

    if (filterSortOption === "low") {
      filtered.sort(
        (a, b) => parseFloat(a.price) - parseFloat(b.price)
      );
    }

    if (filterSortOption === "high") {
      filtered.sort(
        (a, b) => parseFloat(b.price) - parseFloat(a.price)
      );
    }

    return filtered;
  };

  const displayedProducts = handleFilterSort();

  if (loading) {
    return <Spinner />;
  }

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
        <div className="container">
          <h1 className="text-center py-4 fw-semibold">Products</h1>

          <div className="containr my-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="text-muted" style={{ fontSize: "1.1rem" }}>
                Showing <strong>{displayedProducts.length}</strong> product
                {displayedProducts.length != 1 && "s"} for "
                {filterSortOption === "all"
                  ? "All"
                  : filterSortOption.charAt(0).toUpperCase() +
                    filterSortOption.slice(1)}{" "}
                "
              </div>
              <div>
                <select
                  className="form-select py-2 fs-6"
                  style={{
                    minWidth: "260px",
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

          <div className="row">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <div className="col-md-3 mb-4" key={product._id}>
                  <div className="product-item mb-5 text-center position-relative">
                    <div className="product-image w-100 position-relative overflow-hidden">
                      {/* Using the image paths from the backend and the VITE_IMAGE_URL env variable */}
                      {product.image && (
                        <img
                          src={`${IMAGE_URL}${product.image}`}
                          alt="product"
                          className="img-fluid"
                        />
                      )}
                      {product.secondImage && (
                        <img
                          src={`${IMAGE_URL}${product.secondImage}`}
                          alt="product"
                          className="img-fluid"
                        />
                      )}
                      <div className="product-icons gap-3 d-flex">
                        <Link to={`/product/${product._id}`} className="product-icon d-flex" title="View Product">
                          <i className="bi bi-eye fs-5"></i>
                        </Link>
                        <div
                          className="product-icon d-flex"
                          title="Add to Wishlist"
                          onClick={() => addToWishlist(product)}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="bi bi-heart fs-5"></i>
                        </div>
                        <div
                          className="product-icon d-flex"
                          title="Add to Cart"
                          onClick={() => addToCart(product)}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="bi bi-bag fs-5"></i>
                        </div>
                        <div
                          className="product-icon d-flex"
                          title="Update Product"
                          onClick={() => handleEdit(product)}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="bi bi-pencil fs-5"></i>
                        </div>
                        <div
                          className="product-icon d-flex"
                          title="Delete Product"
                          onClick={() => handleDelete(product._id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="bi bi-trash fs-5"></i>
                        </div>
                      </div>
                      <span
                        className={`tag badge text-white ${
                          product.tag === "New" ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {product.tag}
                      </span>
                    </div>
                    <Link
                      to={`/product/${product._id}`}
                      className="text-decoration-none text-black"
                    >
                      <div className="product-content pt-3">
                        {product.oldprice ? (
                          <div className="price">
                            <span className="text-muted text-decoration-line-through me-2">
                              {product.oldprice}
                            </span>
                            <span className="fw-bold text-muted">
                              {product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="price fw-bold">
                            {product.price}
                          </span>
                        )}
                        <h3 className="title pt-1">{product.name}</h3>
                      </div>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center w-100 mt-5">No products found. Add a new product to get started!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
