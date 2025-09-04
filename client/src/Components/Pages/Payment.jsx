/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaystackPop from "@paystack/inline-js";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get order and customer data passed from Checkout
  const { order, customer } = location.state || {};

  const [loading, setLoading] = useState(false);

  const handlePaystackPayment = (method) => {
    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: customer?.email || "customer@example.com",
      amount: order.total * 100, // Paystack uses kobo
      currency: "NGN",
      onSuccess: (transaction) => {
        console.log("Payment successful:", transaction);

        navigate("/receipt", {
          state: {
            order,
            customer,
            paymentMethod: method, // card or transfer
            transactionRef: transaction.reference,
          },
        });
      },
      onCancel: () => {
        alert("Payment cancelled. Try again.");
      },
    });
  };

  const handlePayOnDelivery = () => {
    navigate("/receipt", {
      state: {
        order,
        customer,
        paymentMethod: "Pay on Delivery",
      },
    });
  };

  if (!order || !customer) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        No order data found. Please go back to Checkout.
      </p>
    );
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "80px auto",
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>Choose Payment Method</h2>
      <p style={{ fontSize: "0.9rem", marginBottom: "25px" }}>
        Total Amount: <strong>₦{order.total.toFixed(2)}</strong>
      </p>

      <button
        onClick={() => handlePaystackPayment("Card")}
        style={buttonStyle}
      >
        Pay with Card
      </button>

      <button
        onClick={() => handlePaystackPayment("Transfer")}
        style={buttonStyle}
      >
        Pay with Transfer
      </button>

      <button
        onClick={handlePayOnDelivery}
        style={{
          ...buttonStyle,
          background: "#333",
        }}
      >
        Pay on Delivery
      </button>
    </div>
  );
};

const buttonStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  border: "none",
  borderRadius: "6px",
  background: "#008CBA",
  color: "white",
  fontSize: "1rem",
  cursor: "pointer",
};

export default Payment;
