import React, { useState, useEffect } from "react";

const WaiterForm = ({ addWaiter, updateWaiter, waiter, isEditing, cancelEdit }) => {
  const [formData, setFormData] = useState({ name: "", age: "", phoneNumber: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isEditing && waiter) {
      setFormData({
        name: waiter.name || "",
        age: waiter.age || "",
        phoneNumber: waiter.phoneNumber || ""
      });
    }
  }, [isEditing, waiter]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.name || !formData.age || !formData.phoneNumber) {
      setError("All fields are required!");
      return;
    }

    if (isEditing) {
      updateWaiter(waiter._id, formData)
        .then(() => {
          setFormData({ name: "", age: "", phoneNumber: "" });
          setSuccessMessage("Waiter updated successfully!");
        })
        .catch((err) => setError(err.message || "Failed to update waiter"));
    } else {
      addWaiter(formData)
        .then(() => {
          setFormData({ name: "", age: "", phoneNumber: "" });
          setSuccessMessage("Waiter added successfully!");
        })
        .catch((err) => setError(err.message || "Failed to add waiter"));
    }
  };

  return (
    <div className="form-container fade-in">
  {error && <div className="alert alert-error">{error}</div>}
  {successMessage && <div className="alert alert-success">{successMessage}</div>}
  
  <h3 className="form-title">{isEditing ? "Edit Waiter" : "Add New Waiter"}</h3>
  
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        name="name"
        className="form-control"
        placeholder="Enter name"
        value={formData.name}
        onChange={handleChange}
        required
      />
    </div>
    
    <div className="form-group">
      <label htmlFor="age">Age</label>
      <input
        id="age"
        type="number"
        name="age"
        className="form-control"
        placeholder="Enter age"
        value={formData.age}
        onChange={handleChange}
        required
      />
    </div>
    
    <div className="form-group">
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        id="phoneNumber"
        type="text"
        name="phoneNumber"
        className="form-control"
        placeholder="Enter phone number"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />
    </div>
    
    <div className="form-actions">
      <button type="submit" className="btn btn-primary">
        {isEditing ? "Update Waiter" : "Add Waiter"}
      </button>
      {isEditing && (
        <button type="button" className="btn btn-outline" onClick={cancelEdit}>
          Cancel
        </button>
      )}
    </div>
  </form>
</div>
  );
};

export default WaiterForm;