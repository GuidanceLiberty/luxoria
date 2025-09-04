/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Receipt from "./Receipt";
import ShippingForm from "./ShippingForm";

const IMAGE_BASE =
  import.meta.env.VITE_IMAGE_URL ||
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:6060";

const getImageUrl = (path) => {
  if (!path) return "/images/placeholder.jpg";
  return path.startsWith("http") ? path : `${IMAGE_BASE}${path}`;
};

const Checkout = () => {
  const [deliveryOption, setDeliveryOption] = useState("ship");
  const [cartItems, setCartItems] = useState([]);
  const [newsCheck, setNewsCheck] = useState(false);
  const [billingCheck, setBillingCheck] = useState(true);

  // ✅ NEW STATES
  const [shippingData, setShippingData] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);

    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setCustomerData({ name: savedUser.name, email: savedUser.email });
    }
  }, []);

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price.replace("₦", ""));
    return acc + price * item.quantity;
  }, 0);

  const estimatedTax = (totalPrice * 0.1).toFixed(2);

  // ✅ Handle Place Order
  const handlePlaceOrder = () => {
    if (deliveryOption === "ship" && !shippingData) {
      toast.error("⚠️ Please fill your shipping details!");
      return;
    }

    if (deliveryOption === "pickup") {
      toast.error("⚠️ Pickup is not available for your items. Please select Ship.");
      return;
    }

    const order = {
      products: cartItems.map((item) => ({
        name: item.Productname || item.name,
        qty: item.quantity,
        price: parseFloat(item.price.replace("₦", "")),
      })),
      subtotal: totalPrice,
      tax: parseFloat(estimatedTax),
      shipping: deliveryOption === "ship" ? 5 : 0, // example shipping cost
      total: totalPrice + parseFloat(estimatedTax),
      deliveryOption,
      shippingAddress: deliveryOption === "ship" ? shippingData : null,
    };

    setOrderData(order);

    localStorage.setItem("order", JSON.stringify(order));
    if (customerData) {
      localStorage.setItem("customer", JSON.stringify(customerData));
    }

    toast.success("Order placed successfully!");

    setTimeout(() => {
      setShowReceipt(true);

      // ✅ Clear cart
      localStorage.removeItem("cart");
      setCartItems([]);
      window.dispatchEvent(new Event("cartUpdated"));
    }, 2000);
  };

  // ✅ Show Receipt after order
  if (showReceipt && orderData) {
    return <Receipt customer={customerData} order={orderData} />;
  }

  return (
    <>
      <div className="container-fluid my-5 pt-5" style={{ marginTop: "80px" }}>
        <div className="row g-0">
          {/* LEFT SIDE */}
          <div className="col-12 col-lg-7 px-3 px-md-4" style={{ fontSize: "1rem" }}>
            <h5 className="mb-3" style={{ fontSize: "1.2rem" }}>Contact</h5>
            <input
              type="text"
              className="form-control form-control-lg mb-3 w-100"
              placeholder="Email or Mobile phone number"
              style={{ fontSize: "1.1rem" }}
              value={customerData?.email || ""}
              readOnly
            />
            <div className="form-check mb-4">
              <input
                type="checkbox"
                id="newsCheck"
                className="form-check-input"
                checked={newsCheck}
                onChange={(e) => setNewsCheck(e.target.checked)}
              />
              <label htmlFor="newsCheck" className="form-check-label" style={{ fontSize: "1.05rem" }}>
                Email me with news and offers
              </label>
            </div>

            {/* Delivery Option */}
            <h5 className="mb-3" style={{ fontSize: "1.2rem" }}>Delivery</h5>
            <div className="mb-3 d-flex flex-column flex-md-row gap-2">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="deliveryOption"
                  id="ship"
                  checked={deliveryOption === "ship"}
                  onChange={() => setDeliveryOption("ship")}
                />
                <label htmlFor="ship" className="form-check-label" style={{ fontSize: "1.05rem" }}>
                  Ship
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="deliveryOption"
                  id="pickup"
                  checked={deliveryOption === "pickup"}
                  onChange={() => setDeliveryOption("pickup")}
                />
                <label htmlFor="pickup" className="form-check-label" style={{ fontSize: "1.05rem" }}>
                  Pickup in store
                </label>
              </div>
            </div>

            {deliveryOption === "ship" && (
              <ShippingForm onSave={setShippingData} />
            )}

            {deliveryOption === "pickup" && (
              <div className="alert alert-danger d-flex flex-column rounded-3 mb-3">
                <div className="d-flex align-items-center mb-1">
                  <i className="bi bi-exclamation-circle-fill me-2"></i>
                  <strong style={{ fontSize: "1.1rem" }}>No store available with your items</strong>
                </div>
                <div>
                  <a href="#" className="text-decoration-underline" style={{ fontSize: "1.05rem" }}>
                    Ship to address
                  </a>
                </div>
              </div>
            )}

            {/* Payment */}
            <h4 className="fw-semibold mb-3" style={{ fontSize: "1.2rem" }}>Payment</h4>
            <p className="text-muted mb-3" style={{ fontSize: "1.05rem" }}>
              All transactions are secure and encrypted.
            </p>

            <div className="border rounded mb-4 w-100">
              <div className="bg-light border-bottom d-flex justify-content-between align-items-center p-3" style={{ fontSize: "1.1rem" }}>
                <span className="fw-semibold">Credit Card</span>
                <div className="bg-warning text-white rounded px-2 py-1 fw-bold" style={{ fontSize: "1.1rem" }}>B</div>
              </div>
              <div className="p-3 bg-light">
                <input type="text" className="form-control form-control-lg mb-3 w-100" placeholder="Card number" style={{ fontSize: "1.1rem" }} />
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <input type="text" className="form-control form-control-lg w-100" placeholder="Expiration date (MM / YY)" style={{ fontSize: "1.1rem" }} />
                  </div>
                  <div className="col-12 col-md-6">
                    <input type="text" className="form-control form-control-lg w-100" placeholder="Security code" style={{ fontSize: "1.1rem" }} />
                  </div>
                </div>
                <input type="text" className="form-control form-control-lg mb-3 w-100" placeholder="Name on card" style={{ fontSize: "1.1rem" }} />
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="billingCheck"
                    checked={billingCheck}
                    onChange={(e) => setBillingCheck(e.target.checked)}
                  />
                  <label htmlFor="billingCheck" className="form-check-label" style={{ fontSize: "1.05rem" }}>
                    Use shipping address as billing address
                  </label>
                </div>
              </div>
            </div>

            <button className="btn btn-primary w-100 py-3 mb-4" style={{ fontSize: "1.2rem" }}>
              Pay now
            </button>

            <div className="mt-3 border-top pt-3">
              <a href="#" className="text-decoration-underline" style={{ fontSize: "1.05rem" }}>Privacy policy</a>
            </div>
          </div>

          {/* RIGHT SIDE: Order Summary */}
          <div className="col-12 col-lg-5 px-3 px-md-4 mt-4 mt-lg-0">
            <div className="card border-0 shadow-sm rounded-4 p-4 w-100">
              <h5 className="fw-bold mb-3" style={{ fontSize: "1.2rem" }}>
                <i className="ri-shopping-cart-2-line text-info me-2"></i> Order Summary
              </h5>
              {cartItems.length === 0 ? (
                <p style={{ fontSize: "1.1rem" }}>Your cart is Empty!</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item._id} className="d-flex align-items-center mb-3 border-bottom pb-2">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name || item.Productname}
                      className="rounded me-3"
                      width="70"
                      height="70"
                      style={{ objectFit: "cover", cursor: "pointer" }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1" style={{ fontSize: "1.1rem" }}>{item.Productname || item.name}</h6>
                      <small style={{ fontSize: "1.05rem" }}>Qty: {item.quantity}</small>
                    </div>
                    <div style={{ fontSize: "1.1rem" }}>
                      ${(parseFloat(item.price.replace("₦", "")) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              )}

              <hr />
              <div className="d-flex justify-content-between" style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                <span>Subtotal</span>
                <span>₦{totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between" style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                <span>Shipping</span>
                <span>{deliveryOption === "ship" ? "₦ Based on Address" : "N/A"}</span>
              </div>
              <div className="d-flex justify-content-between" style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                <span>Estimated Tax</span>
                <span>₦{estimatedTax}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>
                <span>Total</span>
                <span>₦{(totalPrice + parseFloat(estimatedTax)).toFixed(2)}</span>
              </div>

              <button
                className="btn btn-success w-100 py-3 mb-3"
                style={{ fontSize: "1.2rem" }}
                onClick={handlePlaceOrder}
              >
                <i className="ri-secure-payment-line me-2"></i>Place Order
              </button>
              <Link to="/cart" className="btn btn-outline-secondary w-100" style={{ fontSize: "1.15rem" }}>
                <i className="ri-arrow-left-line me-1"></i>Back To Cart!
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default Checkout;
