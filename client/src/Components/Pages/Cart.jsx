/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye } from "react-icons/ai";

// ✅ API + Image Base
const API_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE = import.meta.env.VITE_IMAGE_URL;

// Helper to get full image URL
const getImageUrl = (path) => {
  if (!path) return "/images/placeholder.jpg";
  return path.startsWith("http") ? path : `${IMAGE_BASE}${path}`;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const updateQuantity = (_id, type) => {
    const updated = cartItems.map((item) => {
      if (item._id === _id) {
        if (type === "increase") {
          return { ...item, quantity: item.quantity + 1 };
        } else if (type === "decrease" && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (_id) => {
    const updated = cartItems.filter((item) => item._id !== _id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.error("Item Removed From Cart!");
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price.toString().replace("₦", ""));
    return acc + price * item.quantity;
  }, 0);

  return (
    <>
      <style>{`
        .hover-eye .eye-btn {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .hover-eye:hover .eye-btn {
          opacity: 1;
          pointer-events: auto;
        }
        .eye-btn {
          position: absolute;
          top: 6px;
          left: 6px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.1);
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
      `}</style>

      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Home</Link>
        </li>
        <li className="position-relative active">
          <span className="ps-5">Cart</span>
        </li>
      </ol>

      {/* ✅ Full Width Section */}
      <div className="container-fluid my-5">
        <div className="text-center mb-4 fw-bold">🛒 Your Cart</div>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="lead">Your Cart is Empty!</p>
            <Link to="/shop" className="btn mt-3">
              Back To Shop
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="card shadow-sm border-0 rounded-4 mb-3 p-3"
                >
                  <div className="row align-items-center">
                    {/* Product Image */}
                    <div className="col-3 position-relative hover-eye">
                      <img
                        src={getImageUrl(item.image)}
                        className="img-fluid rounded-3"
                        alt={item.name || "Product"}
                        style={{ transition: "opacity 0.3s" }}
                        onMouseEnter={(e) => {
                          if (item.secondImage)
                            e.currentTarget.src = getImageUrl(item.secondImage);
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.src = getImageUrl(item.image);
                        }}
                      />
                      <Link to={`/product/${item._id}`} className="eye-btn">
                        <AiOutlineEye size={16} />
                      </Link>
                    </div>

                    {/* Product Info */}
                    <div className="col-9 d-flex flex-column flex-md-row justify-content-between align-items-center">
                      <div className="text-start w-100">
                        <h5 className="mb-2">{item.name}</h5>
                        <p className="text-muted mb-1">Price: {item.price}</p>
                        <p className="text-muted mb-0">
                          Total ₦
                          {(
                            parseFloat(
                              item.price.toString().replace("₦", "")
                            ) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                        <button
                          className="btn btn-sm"
                          onClick={() => updateQuantity(item._id, "decrease")}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="btn btn-sm"
                          onClick={() => updateQuantity(item._id, "increase")}
                        >
                          +
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeItem(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold">Cart Summary</h4>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Items</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Price</span>
                  <span className="fw-bold">₦{totalPrice.toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="btn w-100">
                  Proceed To Checkout
                </Link>
              </div>
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  );
};

export default Cart;
