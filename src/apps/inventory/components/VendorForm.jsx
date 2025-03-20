
// VendorForm.jsx
import React, { useState, useEffect } from "react";

const VendorForm = ({ addVendor, updateVendor, vendor, isEditing, cancelEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phoneNumber: "",
    location: {
      address: "",
      city: "",
      state: "",
      zip: ""
    }
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isEditing && vendor) {
      setFormData({
        name: vendor.name || "",
        age: vendor.age || "",
        phoneNumber: vendor.phoneNumber || "",
        location: vendor.location || { address: "", city: "", state: "", zip: "" }
      });
    }
  }, [isEditing, vendor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["address", "city", "state", "zip"].includes(name)) {
      setFormData({
        ...formData,
        location: { ...formData.location, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.name || !formData.age || !formData.phoneNumber || !formData.location.address) {
      setError("All fields are required!");
      return;
    }

    if (isEditing) {
      updateVendor(vendor._id, formData)
        .then(() => {
          setFormData({ name: "", age: "", phoneNumber: "", location: { address: "", city: "", state: "", zip: "" } });
          setSuccessMessage("Vendor updated successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        })
        .catch((err) => setError(err.message || "Failed to update vendor"));
    } else {
      addVendor(formData)
        .then(() => {
          setFormData({ name: "", age: "", phoneNumber: "", location: { address: "", city: "", state: "", zip: "" } });
          setSuccessMessage("Vendor added successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        })
        .catch((err) => setError(err.message || "Failed to add vendor"));
    }
  };

  return (
    <div className="vendor-form">
      <h3>{isEditing ? "Edit Vendor" : "Add New Vendor"}</h3>
      
      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          placeholder="Name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="number" 
          name="age" 
          placeholder="Age" 
          value={formData.age} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="phoneNumber" 
          placeholder="Phone Number" 
          value={formData.phoneNumber} 
          onChange={handleChange} 
          required 
        />

        <h4>Location Details</h4>
        <input 
          type="text" 
          name="address" 
          placeholder="Address" 
          value={formData.location.address} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="city" 
          placeholder="City" 
          value={formData.location.city} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="state" 
          placeholder="State" 
          value={formData.location.state} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="zip" 
          placeholder="ZIP Code" 
          value={formData.location.zip} 
          onChange={handleChange} 
          required 
        />

        <div className="form-actions">
          <button type="submit">{isEditing ? "Update Vendor" : "Add Vendor"}</button>
          {isEditing && <button type="button" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>
    </div>
  );
};

export default VendorForm;