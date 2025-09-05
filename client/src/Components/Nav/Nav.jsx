import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";

const Nav = () => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const updateCounts = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const totalCartItems = cart.reduce(
      (acc, item) => acc + (item.quantity || 1),
      0
    );
    setCartCount(totalCartItems);
    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    updateCounts();
    const handleCartUpdate = () => updateCounts();
    const handleWishlistUpdate = () => updateCounts();
    const onStorageChange = (e) => {
      if (e.key === "cart" || e.key === "wishlist") updateCounts();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
      window.removeEventListener("storage", onStorageChange);
    };
  }, [user]);

  const handleLogout = () => {
    toast.success("Logged out successfully!", {
      onClose: () => {
        logout();
        navigate("/login"); 
      },
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  return (
    <div className="nav w-100 fixed-top bg-white shadow-sm">
      <nav className="navbar navbar-expand-lg py-3 w-100 nav-wrapper">
        {/* Mobile Toggle */}
        <div className="d-flex d-lg-none align-items-center gap-3">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Mobile Logo */}
        <Link to="/" className="navbar-brand mx-auto d-lg-none">
          <h2 className="m-0 fw-bold" style={{ letterSpacing: "2px" }}>
            BEAUTIFY
          </h2>
        </Link>

        {/* Mobile Icons */}
        <div className="d-flex d-lg-none align-items-center gap-3">
          <a href="#" className="text-dark fs-5 bi bi-search"></a>
          <div className="dropdown">
            <a
              className="text-dark fs-5 bi bi-person dropdown-toggle"
              href="#"
              role="button"
              id="mobileUserDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="mobileUserDropdown"
            >
              {user ? (
                <>
                  <li>
                    <Link className="dropdown-item" to={`/profile/${user._id}`}>
                      Profile
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/categories">
                          Categories
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/manage-users">
                          Manage Users
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link className="dropdown-item" to="/login">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <Link
            to="/create-product"
            className="text-dark fs-5 bi bi-plus-square"
          ></Link>
          <Link to="/wishlist" className="text-dark fs-5 position-relative">
            <i className="bi bi-heart"></i>
            <span className="position-absolute top-0 start-100 translate-middle cart-qount rounded-pill">
              {wishlistCount}
            </span>
          </Link>
          <Link to="/cart" className="text-dark fs-5 position-relative">
            <i className="bi bi-bag"></i>
            <span className="position-absolute top-0 start-100 translate-middle cart-qount rounded-pill">
              {cartCount}
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarNav"
        >
          <ul className="navbar-nav nav-menu align-items-center gap-4">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/shop" className="nav-link">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/store" className="nav-link">
                Store
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className="nav-link">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>
          </ul>

          {/* Center Logo */}
          <Link to="/" className="navbar-brand order-0 d-none d-lg-flex">
            <h2 className="m-0 fw-bold" style={{ letterSpacing: "2px" }}>
              BEAUTIFY
            </h2>
          </Link>

          {/* Desktop Icons */}
          <ul className="navbar-nav d-none d-lg-flex align-items-center gap-4">
            <li>
              <Link to="/search" className="text-dark fs-5 bi bi-search"></Link>
            </li>
            <li className="dropdown">
              <a
                className="text-dark fs-5 bi bi-person dropdown-toggle"
                href="#"
                role="button"
                id="desktopUserDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="desktopUserDropdown"
              >
                {user ? (
                  <>
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/profile/${user._id}`}
                      >
                        Profile
                      </Link>
                    </li>
                    {user.role === "admin" && (
                      <>
                        <li>
                          <Link className="dropdown-item" to="/categories">
                            Categories
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/manage-users">
                            Manage Users
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/login">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/register">
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </li>
            <li>
              <Link
                to="/create-product"
                className="text-dark fs-5 bi bi-plus-square"
              ></Link>
            </li>
            <li className="position-relative">
              <Link to="/wishlist" className="text-dark fs-5">
                <i className="bi bi-heart"></i>
                <span className="position-absolute top-0 start-100 translate-middle cart-qount rounded-pill">
                  {wishlistCount}
                </span>
              </Link>
            </li>
            <li className="position-relative">
              <Link to="/cart" className="text-dark fs-5">
                <i className="bi bi-bag"></i>
                <span className="position-absolute top-0 start-100 translate-middle cart-qount rounded-pill">
                  {cartCount}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
