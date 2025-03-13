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
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

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
        <button type="submit">
          {isEditing ? "Update Waiter" : "Add Waiter"}
        </button>
        {isEditing && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default WaiterForm;