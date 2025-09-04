// src/components/ShippingForm.jsx
import React, { useState, useEffect } from "react";
import nigeriaStates from "../../data/nigeriaStates";

const ShippingForm = ({ onSave }) => {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  // ✅ Whenever saveInfo is checked and form is valid, call onSave automatically
  useEffect(() => {
    if (saveInfo && state && city && address) {
      onSave({ state, city, address, postalCode });
    }
  }, [saveInfo, state, city, address, postalCode, onSave]);

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 mt-3">
      <h5 className="fw-bold mb-3">Shipping Information</h5>

      {/* State Dropdown */}
      <div className="mb-3">
        <label className="form-label">State</label>
        <select
          className="form-select dropdown-menu-end"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setCity(""); // reset city when state changes
          }}
          data-bs-display="static" // ✅ force dropdown not to flip
          style={{ position: "relative" }}
        >
          <option value="">Select State</option>
          {Object.keys(nigeriaStates).map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* City Dropdown */}
      {state && (
        <div className="mb-3">
          <label className="form-label">City</label>
          <select
            className="form-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            data-bs-display="static"
            style={{ position: "relative" }}
          >
            <option value="">Select City</option>
            {nigeriaStates[state].map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Address */}
      <div className="mb-3">
        <label className="form-label">Street Address</label>
        <input
          type="text"
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g 12 Allen Avenue"
          required
        />
      </div>

      {/* Postal Code (Optional) */}
      <div className="mb-3">
        <label className="form-label">Postal Code (Optional)</label>
        <input
          type="text"
          className="form-control"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="e.g 100001"
        />
      </div>

      {/* ✅ Save Info Checkbox */}
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="saveInfo"
          checked={saveInfo}
          onChange={(e) => setSaveInfo(e.target.checked)}
        />
        <label htmlFor="saveInfo" className="form-check-label">
          Save this shipping information for next time
        </label>
      </div>
    </div>
  );
};

export default ShippingForm;
