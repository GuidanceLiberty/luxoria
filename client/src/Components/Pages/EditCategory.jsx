import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { RiBowlLine, RiMapPin2Line, RiCheckLine, RiDeleteBin2Line } from "@remixicon/react";
import { categorySchema } from "../../schemas";
import placeholder from "../../assets/placeholder.jpg";

const EditCategory = () => {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const { category_id } = useParams();
  const user = JSON.parse(localStorage.getItem("userData"));

  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data: category, isLoading } = useSWR(`${API_URL}/categories/${category_id}`, fetcher);

  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (category?.data?.photo) setPhoto(category.data.photo);
  }, [category]);

  const onSubmit = async (values, actions) => {
    if (!window.confirm("Are you sure you want to update this category?")) return;

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);

      if (photo && typeof photo !== "string") {
        formData.append("photo", photo);
      }

      const response = await fetch(`${API_URL}/categories/${category_id}`, {
        method: "PUT",
        body: formData,
      });

      const res = await response.json();

      if (res.success) {
        toast.success(res.message || "Category updated successfully!");
        actions.resetForm();
        setTimeout(() => navigate("/categories"), 1500);
      } else {
        toast.error(res.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error.message);
      toast.error("Error occurred while updating category");
    }
  };

  const removeCategory = async () => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${API_URL}/categories/${category_id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success("Category deleted");
        setTimeout(() => navigate("/categories"), 1500);
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error.message);
      toast.error("Error occurred while deleting category");
    }
  };

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue } = useFormik({
    initialValues: {
      name: category?.data?.name || "",
      description: category?.data?.description || "",
    },
    validationSchema: categorySchema,
    enableReinitialize: true,
    onSubmit,
  });

  if (isLoading) return <p className="text-center mt-4">Loading category...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Edit Category</h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label d-flex align-items-center gap-2">
            <RiBowlLine size={16} /> Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Category Name"
            className={`form-control ${touched.name && errors.name ? "is-invalid" : ""}`}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.name && errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label d-flex align-items-center gap-2">
            <RiMapPin2Line size={16} /> Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            className={`form-control ${touched.description && errors.description ? "is-invalid" : ""}`}
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.description && errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        {/* Upload Photo */}
        <div className="mb-3">
          <label className="form-label">Category Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              setPhoto(file);
              setFieldValue("photo", file);
            }}
          />
          <div className="mt-2">
            {photo ? (
              <img
                src={typeof photo === "string" ? photo : window.URL.createObjectURL(photo)}
                alt="Category"
                className="w-24 h-24 my-2 rounded-2xl"
              />
            ) : (
              <img src={placeholder} alt="placeholder" className="w-24 h-24 my-2 rounded-2xl" />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success d-flex align-items-center gap-2" disabled={isSubmitting}>
            <RiCheckLine /> Update Category
          </button>
          {user?.role === "admin" && (
            <button type="button" className="btn btn-danger d-flex align-items-center gap-2" onClick={removeCategory}>
              <RiDeleteBin2Line /> Delete Category
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
