/* eslint-disable no-unused-vars */
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { RiAddLine, RiDeleteBin3Line, RiPencilLine, RiSettings2Line, RiStarFill } from "@remixicon/react";
import { useState } from "react";
import useSWR from "swr";

const Profile = () => {
  const userData = localStorage.getItem("userData");
  const user = JSON.parse(userData);
  const params = useParams();
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const URL = import.meta.env.VITE_BASE_URL;
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: categories, mutate, error, isLoading } = useSWR(`${URL}/categories`, fetcher);

  return (
    <section className="container mt-5">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="fw-bold text-capitalize">Your Profile</h2>
        <div className="mx-auto border border-3 border-warning rounded w-25"></div>
      </div>

      {/* Profile Info Card */}
      <div className="card shadow-sm p-4">
        <div className="d-flex flex-column align-items-center">
          <div className="rounded-circle bg-secondary d-flex justify-content-center align-items-center mb-3" style={{ width: "80px", height: "80px" }}>
            <RiStarFill size={30} color="white" />
          </div>
          <h5 className="mb-1">{user?.name || "Guest User"}</h5>
          <p className="text-muted mb-2">{user?.email || "No email provided"}</p>
          <span className={`badge ${user?.role === "admin" ? "bg-danger" : "bg-primary"}`}>
            {user?.role || "user"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 d-flex justify-content-center gap-2">
          <NavLink to="/categories" className="btn btn-outline-primary d-flex align-items-center gap-2">
            <RiSettings2Line /> Manage Categories
          </NavLink>
          <button
            className="btn btn-outline-success d-flex align-items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <RiAddLine /> Create Category
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
