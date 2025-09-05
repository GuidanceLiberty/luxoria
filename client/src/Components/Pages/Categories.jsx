import { NavLink, useNavigate } from 'react-router-dom';
import { RiAddLine, RiDeleteBin3Line, RiPencilLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '../../context/AuthContext';
import CreateCategoryModal from '../modals/categories/CreateCategoryModal';
import placeholder from '../../assets/placeholder.jpg';

const Categories = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const URL = import.meta.env.VITE_BASE_URL;
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: categories, mutate } = useSWR(`${URL}/categories`, fetcher);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate(`/access-denied`);
    }
  }, [user]);

  return (
    <section className="container py-4">
      <div className="mb-4">
        <h2 className="h4 mb-2 text-capitalize">Categories</h2>
        <div className="border border-3 border-warning w-25"></div>
      </div>

      {/* TABLE */}
      <div className="table-responsive shadow-sm mb-4">
        <table className="table table-hover align-middle text-nowrap">
          <thead className="table-secondary">
            <tr>
              <th>Photo</th>
              <th className="cursor-pointer">Name</th>
              <th className="cursor-pointer">Description</th>
              <th className="text-end">
                <RiAddLine onClick={() => setShowCreateModal(true)} className="cursor-pointer" />
              </th>
            </tr>
          </thead>
          <tbody>
            {categories?.data?.length > 0 ? (
              categories.data.map((category) => (
                <tr key={category._id}>
                  <td>
                    <img src={category.photo || placeholder} alt={category.name} className="rounded-circle" width="40" height="40" />
                  </td>
                  <td>
                    <NavLink to={`/category/${category._id}`} className="text-decoration-none text-dark">
                      {category.name}
                    </NavLink>
                  </td>
                  <td>{category.description}</td>
                  <td className="text-end">
                    <NavLink to={`/categories/edit/${category._id}`} className="me-2">
                      <RiPencilLine className="fs-5" style={{ cursor: "pointer" }} />
                    </NavLink>
                    <RiDeleteBin3Line
                      className="fs-5 text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={async () => {
                        if (confirm(`Delete category "${category.name}"?`)) {
                          await fetch(`${URL}/categories/${category._id}`, { method: "DELETE" });
                          mutate(); // ✅ Refresh categories list immediately
                        }
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No categories found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        URL={URL}
        placeholder={placeholder}
        showCreateModal={showCreateModal}
        closeModal={() => setShowCreateModal(false)}
        mutate={mutate} // ✅ Pass mutate so modal can refresh list immediately
      />
    </section>
  );
};

export default Categories;
