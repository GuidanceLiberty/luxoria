import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";

const CreateProduct = ({ fetchProducts }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const API = import.meta.env.VITE_BASE_URL || "http://localhost:6060/api";

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    oldprice: "",
    tag: "",
    description: "",
    image: null,
    secondImage: null,
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewSecondImage, setPreviewSecondImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/categories`);
        // Backend returns { success: true, message: "...", data: [ ... ] }
        if (res.data && res.data.success) {
          setCategories(res.data.data || []);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, [API]);

  // Show message if redirected with location.state.message
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
    // Capitalize the first letter of the product name
    if (name === "name") {
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setFormData({ ...formData, [name]: updatedValue });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData({ ...formData, [name]: file });

    if (file) {
      const previewURL = URL.createObjectURL(file);
      if (name === "image") setPreviewImage(previewURL);
      if (name === "secondImage") setPreviewSecondImage(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error("⚠ Please select a category");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      if (formData.oldprice) data.append("oldprice", formData.oldprice);
      if (formData.tag && formData.tag.trim() !== "") data.append("tag", formData.tag);
      if (formData.description && formData.description.trim() !== "")
        data.append("description", formData.description);
      if (formData.image) data.append("image", formData.image);
      if (formData.secondImage) data.append("secondImage", formData.secondImage);
      data.append("category", formData.category);

      const res = await axios.post(`${API}/products`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "✅ Product created successfully!");
      if (fetchProducts) fetchProducts();

      navigate("/shop", {
        state: { message: res.data.message || "Product created successfully!" },
      });
    } catch (err) {
      console.error("Error creating product:", err.response?.data || err);
      const errorMsg = err.response?.data?.message || "❌ Failed to create product.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Home</Link>
        </li>
        <li className="position-relative">
          <Link to="/shop">Shop</Link>
        </li>
        <li className="position-relative active">
          <span className="ps-5">Create Product</span>
        </li>
      </ol>

      <div className="main-content-padding container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">Create New Product</h2>
          <Link to="/shop" className="btn btn-dark">
            &larr; Back to Shop
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Price *</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category Select */}
            <div className="col-md-6">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Old Price</label>
              <input
                type="number"
                className="form-control"
                name="oldprice"
                value={formData.oldprice}
                onChange={handleChange}
              />
            </div>

            {/* Tag Dropdown */}
            <div className="col-md-6">
              <label className="form-label">Tag</label>
              <select
                className="form-select"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
              >
                <option value="">-- Select Tag (optional) --</option>
                <option value="Sale">Sale</option>
                <option value="New">New</option>
                <option value="Featured">Featured</option>
                <option value="Favorite">Favorite</option> 

              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Description *</label>
              <textarea
                className="form-control"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="col-md-6">
              <label className="form-label">Main Image *</label>
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={handleFileChange}
                required
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="img-thumbnail mt-2"
                  style={{ maxHeight: "150px" }}
                />
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Second Image (optional)</label>
              <input
                type="file"
                className="form-control"
                name="secondImage"
                onChange={handleFileChange}
              />
              {previewSecondImage && (
                <img
                  src={previewSecondImage}
                  alt="Preview"
                  className="img-thumbnail mt-2"
                  style={{ maxHeight: "150px" }}
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 mt-4"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              "Create Product"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProduct;
