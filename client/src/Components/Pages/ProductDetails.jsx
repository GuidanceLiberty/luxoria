/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_BASE_URL;
  const IMAGE_BASE = import.meta.env.VITE_IMAGE_URL;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/single-product/${id}`);
        const data = await response.json();

        if (data.success) {
          const p = data.data;
          setProduct(p);

          const imgs = [];
          if (p?.image) imgs.push(p.image.startsWith("http") ? p.image : `${IMAGE_BASE}${p.image}`);
          if (p?.secondImage) imgs.push(p.secondImage.startsWith("http") ? p.secondImage : `${IMAGE_BASE}${p.secondImage}`);
          setImages(imgs);
          setMainImage(imgs[0] || "");
        } else {
          toast.error(data.message || "Failed to fetch product.");
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API_URL, IMAGE_BASE]);

  // Navigate to update page
  const handleEdit = () => {
    if (product?._id) {
      navigate(`/update-product/${product._id}`);
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!product?._id) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/products/${product._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      navigate("/shop", {
        state: { message: `"${product.name}" deleted successfully!` },
      });
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete product");
    }
  };

  // ✅ Add to cart logic like Shop.jsx
  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    const alreadyInCart = existing.find((p) => p._id === product._id);

    if (!alreadyInCart) {
      const updatedCart = [...existing, { ...product, quantity }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.name} added to your cart`);
    } else {
      toast.info(`${product.name} is already in your cart!`);
    }
  };

  const colors = ["#000000", "#7B3F00", "#9BBEC8"];

  if (loading) {
    return <div className="text-center my-5">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center my-5">Product not found</div>;
  }

  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Home</Link>
        </li>
        <li className="position-relative active ps-5">Beauty & Cosmetics</li>
        <li className="position-relative active ps-5">{product.name}</li>
      </ol>

      <div className="container py-5">
        <div className="row">
          {/* LEFT SIDE IMAGES */}
          <div className="col-xl-6">
            <div className="d-flex flex-column-reverse flex-md-row mb-4">
              <div className="d-flex flex-md-column me-3 thumbnail-images">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    onClick={() => setMainImage(img)}
                    className={`img-thumbnail mb-2 ${mainImage === img ? "border-dark" : "border"}`}
                    style={{ width: 70, height: 70, objectFit: "cover", cursor: "pointer" }}
                  />
                ))}
              </div>

              <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img
                  src={mainImage}
                  alt="Main"
                  className="img-fluid"
                  style={{ maxHeight: 500, maxWidth: "100%", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE INFO */}
          <div className="col-xl-6">
            <h5 className="fw-bold">₦{product.price}</h5>
            <div className="d-flex align-items-start justify-content-between">
              <h2 className="mb-3 fw-semibold">{product.name}</h2>

              {/* Edit / Delete */}
              {user && user.role === 'admin' && (
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-primary btn-sm d-flex align-items-center" onClick={handleEdit}>
                  <FaEdit className="me-2" />
                  Edit
                </button>
                <button type="button" className="btn btn-outline-danger btn-sm d-flex align-items-center" onClick={handleDelete}>
                  <FaTrash className="me-2" />
                  Delete
                </button>
              </div>
              )}
            </div>

            <p className="mb-1 fw-semibold">Color: Black</p>
            <div className="d-flex gap-2 mb-4">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  style={{ backgroundColor: color, width: 25, height: 25, borderRadius: "50%", border: "1px solid #ccc", cursor: "pointer" }}
                ></div>
              ))}
            </div>

            <p className="fw-semibold mb-1">Quantity</p>
            <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
              <div className="d-flex align-items-center Quantity-box" style={{ maxWidth: "200px" }}>
                <button className="btn-count border-0" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                <input type="text" className="form-control text-center mx-2" value={quantity} readOnly />
                <button className="btn-count border-0" onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>

              {/* ✅ Updated Add to cart button */}
              <button
                className="btn-custome2 border-0 px-4 py-2"
                onClick={() => addToCart(product)}
              >
                Add to cart
              </button>
            </div>

            <button
              className="btn-custome2 w-100 border-0 mt-2"
              onClick={() => { addToCart(product); navigate("/cart"); }}
            >
              Buy it now
            </button>

            <hr />
            <p><strong>Vendor:</strong> Vendor 4</p>
            <p><strong>Collection:</strong> Beauty & Cosmetics, Bestseller, Featured, New Arrival, Skincare, under $40</p>
            <p><strong>SKU:</strong> 501</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="container my-5">
        <ul className="nav nav-tabs border-0 justify-content-center mb-4">
          <li className="nav-item">
            <button className={`nav-link tab border-0 fw-bold fs-4 text-capitalize ${activeTab === "description" ? "active" : ""}`} onClick={() => setActiveTab("description")}>
              Description
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link tab border-0 fw-bold fs-4 text-capitalize ${activeTab === "shipping" ? "active" : ""}`} onClick={() => setActiveTab("shipping")}>
              Shipping & Return
            </button>
          </li>
        </ul>

        <div className="tab-content" id="productTabContent">
          {activeTab === "description" && (
            <div className="tab-pane fade show active">
              <p>{product.description || "No description available."}</p>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="tab-pane fade show active">
              <p>
                We typically process and ship orders within 1 week, with shipping costs calculated at checkout based on your location and selected method. Free shipping is available for orders over ₦50. Once your order ships, you'll receive a confirmation email with a tracking number.
              </p>
              <p>
                Standard shipping usually takes 5–7 business days, with express options available. If you need to change your shipping address, contact us as soon as possible.
              </p>
              <p>
                Returns are accepted within 1 week, provided items are unused and in their original packaging. Refunds are processed within 3–5 business days after we receive and inspect the returned items.
              </p>
              <p>
                Exchanges are available for size or product variants. For questions, feel free to contact our support team.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default ProductDetails;