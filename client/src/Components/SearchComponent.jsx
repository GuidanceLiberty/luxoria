import { FaFeatherAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const SearchComponent = ({ headerText, query, setQuery, handleSearch }) => {
  return (
    <div className="w-100 m-0 p-0">
      {/* Header */}
      <div className="d-flex align-items-center mb-3 justify-content-center">
        <FaFeatherAlt size={18} className="text-danger me-2" />
        <span className="fs-5 fw-semibold">{headerText}</span>
      </div>

      {/* Full-width Search */}
      <form onSubmit={handleSearch} className="w-100 m-0 p-0">
        <div
          className="d-flex align-items-center mx-auto"
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "9999px",
            padding: "10px 18px",
            width: "100%",
            maxWidth: "800px",
            border: "1px solid #dee2e6",
          }}
        >
          <FiSearch className="text-muted me-2" size={18} />
          <input
            type="text"
            className="form-control bg-transparent border-0 fw-semibold text-dark"
            style={{ boxShadow: "none", fontSize: "1rem" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
          />
          <button
            type="submit"
            className="btn btn-sm btn-danger rounded-pill px-3 fw-semibold"
          >
            <FiSearch />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
