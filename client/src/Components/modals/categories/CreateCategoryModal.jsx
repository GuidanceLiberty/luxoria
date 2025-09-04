import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateCategoryModal = ({ URL, placeholder, showCreateModal, closeModal, mutate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(file);

    // Use browser's URL object explicitly to generate preview
    const previewUrl = typeof window !== "undefined" ? window.URL.createObjectURL(file) : null;
    setPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required!");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    if (description.trim()) data.append("description", description);
    if (photo) data.append("photo", photo);

    try {
      setSaving(true);
      const res = await axios.post(`${URL}/categories`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Category created successfully!");

      // Reset form
      setName("");
      setDescription("");
      setPhoto(null);
      setPreview(null);
      closeModal();

      // Refresh categories list immediately
      if (mutate) mutate();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  if (!showCreateModal) return null;

  return (
    <>
      <div className="modal show fade" style={{ display: "block" }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Category</h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Photo</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="img-thumbnail mt-2"
                      style={{ maxHeight: 150 }}
                    />
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-dark" disabled={saving}>
                  {saving ? <span className="spinner-border spinner-border-sm"></span> : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default CreateCategoryModal;
