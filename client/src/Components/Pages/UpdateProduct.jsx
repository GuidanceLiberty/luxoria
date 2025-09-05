import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const { product_id } = useParams();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    oldprice: "",
    tag: "",
    description: "",
    image: null,
    secondImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [previewSecondImage, setPreviewSecondImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [existingSecondImage, setExistingSecondImage] = useState("");

  // Category state
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(""); // selected category id
  const [showCatModal, setShowCatModal] = useState(false);
  const [catSearch, setCatSearch] = useState("");

  // ---------- Fetch product + categories ----------
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        // product
        const res = await axios.get(`${API}/products/single-product/${product_id}`);
        const product = res.data?.data;

        if (!product) {
          toast.error("Product not found.");
          return navigate("/shop");
        }

        setFormData({
          name: product.name || "",
          price: product.price ?? "",
          oldprice: product.oldprice ?? "",
          tag: product.tag ?? "",
          description: product.description ?? "",
          image: null,
          secondImage: null,
        });

        setExistingImage(product.image || "");
        setExistingSecondImage(product.secondImage || "");

        const currentCatId =
          typeof product.category === "object" && product.category
            ? product.category._id
            : product.category || "";
        setCategoryId(currentCatId);

        // categories
        setCatLoading(true);
        const catRes = await axios.get(`${API}/categories`);
        setCategories(catRes.data?.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product details.");
        navigate("/shop");
      } finally {
        setCatLoading(false);
        setLoading(false);
      }
    };

    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);

  // ---------- Handlers ----------
  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0];
    setFormData((s) => ({ ...s, [name]: file }));

    if (file) {
      const url = URL.createObjectURL(file);
      if (name === "image") setPreviewImage(url);
      if (name === "secondImage") setPreviewSecondImage(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error("Please choose a category.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("oldprice", formData.oldprice || "");
    data.append("category", categoryId);

    if (formData.tag.trim() !== "") data.append("tag", formData.tag);
    if (formData.description.trim() !== "") data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);
    if (formData.secondImage) data.append("secondImage", formData.secondImage);

    try {
      setSaving(true);
      const res = await axios.put(`${API}/products/${product_id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "✅ Product updated successfully!");
      navigate("/shop", {
        state: { message: res.data.message || "Product updated successfully!" },
      });
    } catch (err) {
      console.error("Update error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "❌ Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Category helpers ----------
  const selectedCategory = useMemo(
    () => categories.find((c) => String(c._id) === String(categoryId)),
    [categories, categoryId]
  );

  const filteredCategories = useMemo(() => {
    const q = catSearch.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [categories, catSearch]);

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center my-4">Update Product</h2>

      {/* Category bar */}
      <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
        <span className="fw-semibold">Category:</span>
        {selectedCategory ? (
          <span className="badge text-bg-dark px-3 py-2">
            {selectedCategory.name}
          </span>
        ) : (
          <span className="badge text-bg-secondary px-3 py-2">None selected</span>
        )}
        <button
          type="button"
          className="btn btn-outline-dark btn-sm"
          onClick={() => setShowCatModal(true)}
          disabled={catLoading}
        >
          {selectedCategory ? "Change Category" : "Choose Category"}
        </button>
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
              <option value="">-- Select Tag --</option>
              <option value="New">New</option>
              <option value="Sale">Sale</option>
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
            />
          </div>

          {/* Main image */}
          <div className="col-md-6">
            <label className="form-label">Main Image</label>
            <input
              type="file"
              className="form-control"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
            {(previewImage || existingImage) && (
              <img
                src={previewImage || existingImage}
                alt="Main"
                className="img-thumbnail mt-2"
                style={{ maxHeight: 150 }}
              />
            )}
          </div>

          {/* Second image */}
          <div className="col-md-6">
            <label className="form-label">Second Image</label>
            <input
              type="file"
              className="form-control"
              name="secondImage"
              onChange={handleFileChange}
              accept="image/*"
            />
            {(previewSecondImage || existingSecondImage) && (
              <img
                src={previewSecondImage || existingSecondImage}
                alt="Second"
                className="img-thumbnail mt-2"
                style={{ maxHeight: 150 }}
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-dark w-100 mt-4"
          disabled={saving}
        >
          {saving ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            "Update Product"
          )}
        </button>
      </form>

      {/* Category Picker Modal */}
      {showCatModal && (
        <div className="modal show fade" style={{ display: "block" }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Choose Category</h5>
                <button type="button" className="btn-close" onClick={() => setShowCatModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search categories…"
                    value={catSearch}
                    onChange={(e) => setCatSearch(e.target.value)}
                  />
                </div>

                {catLoading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-dark" role="status">
                      <span className="visually-hidden">Loading…</span>
                    </div>
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <p className="text-muted mb-0">No categories found.</p>
                ) : (
                  <div className="row g-3">
                    {filteredCategories.map((cat) => (
                      <div className="col-md-6" key={cat._id}>
                        <div
                          className={`card h-100 shadow-sm ${
                            String(categoryId) === String(cat._id) ? "border-dark" : ""
                          }`}
                          role="button"
                          onClick={() => setCategoryId(cat._id)}
                        >
                          {cat.photo ? (
                            <img
                              src={cat.photo}
                              alt={cat.name}
                              className="card-img-top"
                              style={{ height: 140, objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              className="d-flex align-items-center justify-content-center bg-light"
                              style={{ height: 140 }}
                            >
                              <span className="text-muted">{cat.name}</span>
                            </div>
                          )}
                          <div className="card-body">
                            <h6 className="card-title mb-1">{cat.name}</h6>
                            <p className="card-text small text-muted mb-0">
                              {cat.description?.length > 90
                                ? cat.description.slice(0, 90) + "…"
                                : cat.description || "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowCatModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-dark"
                  onClick={() => setShowCatModal(false)}
                  disabled={!categoryId}
                >
                  Use Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCatModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default UpdateProduct;
