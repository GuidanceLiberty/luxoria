/* eslint-disable no-unused-vars */
import React, { useRef } from "react";

const Receipt = ({ order, customer }) => {
  const receiptRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      ref={receiptRef}
      style={{
        width: "95%", // take almost full width on small screens
        maxWidth: "500px", // still limit on bigger screens
        margin: "80px auto 20px", // pushed down to avoid navbar overlap
        padding: "15px",
        fontFamily: "'Courier New', monospace",
        background: "white",
        border: "1px solid #ccc",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* Company Header */}
      <h2 style={{ textAlign: "center", margin: "0", fontSize: "1.3rem" }}>
        BEAUTIFY
      </h2>
      <p style={{ textAlign: "center", margin: "0", fontSize: "0.9rem" }}>
        Official Receipt
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.8rem",
          margin: "0 0 8px",
        }}
      >
        Thank you for shopping with us
      </p>
      <hr style={{ border: "1px dashed #000", margin: "10px 0" }} />

      {/* Customer Info */}
      <div style={{ fontSize: "0.85rem", marginBottom: "10px" }}>
        <p>
          <strong>Customer:</strong> {customer?.name || "Guest"}
        </p>
        <p>
          <strong>Email:</strong> {customer?.email || "N/A"}
        </p>
        <p>
          <strong>Date:</strong> {new Date().toLocaleString()}
        </p>
        <p>
          <strong>Order ID:</strong> #{Math.floor(Math.random() * 1000000)}
        </p>
      </div>

      <hr style={{ border: "1px dashed #000", margin: "10px 0" }} />

      {/* Order Details */}
      <table style={{ width: "100%", fontSize: "0.9rem" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Item</th>
            <th style={{ textAlign: "center" }}>Qty</th>
            <th style={{ textAlign: "right" }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td style={{ textAlign: "center" }}>{item.qty}</td>
              <td style={{ textAlign: "right" }}>
                ${(item.price * item.qty).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ border: "1px dashed #000", margin: "10px 0" }} />

      {/* Totals */}
      <div style={{ fontSize: "0.9rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Subtotal</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Tax</span>
          <span>${order.tax.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Shipping</span>
          <span>${order.shipping.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            marginTop: "8px",
          }}
        >
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <hr style={{ border: "1px dashed #000", margin: "15px 0" }} />

      {/* Footer */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.8rem",
          marginBottom: "5px",
        }}
      >
        *** No Refunds or Exchanges ***
      </p>
      <p style={{ textAlign: "center", fontSize: "0.8rem" }}>
        Powered by BEAUTIFY Store
      </p>

      {/* Print Button */}
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <button
          onClick={handlePrint}
          style={{
            padding: "8px 20px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "3px",
            fontSize: "0.9rem",
          }}
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default Receipt;
