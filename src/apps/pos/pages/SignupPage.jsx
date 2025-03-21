import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function SignupPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    password: "",
    restaurantId: "",
    pin: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(formData.pin)) {
      alert("PIN must be a 4-digit number");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert("Signup successful! Please login with your credentials.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Signup failed");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {" "}
      <input
        type="text"
        name="firstname"
        placeholder="First Name"
        value={formData.firstname}
        onChange={handleChange}
        required
      />{" "}
      <input
        type="text"
        name="lastname"
        placeholder="Last Name"
        value={formData.lastname}
        onChange={handleChange}
        required
      />{" "}
      <input
        type="text"
        name="phonenumber"
        placeholder="Phone Number"
        value={formData.phonenumber}
        onChange={handleChange}
        required
      />{" "}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />{" "}
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />{" "}
      <input
        type="text"
        name="restaurantId"
        placeholder="Restaurant ID"
        value={formData.restaurantId}
        onChange={handleChange}
        required
      />{" "}
      <input
        type="text"
        name="pin"
        placeholder="4-digit PIN"
        maxLength="4"
        value={formData.pin}
        onChange={handleChange}
        required
      />{" "}
      <button type="submit">Sign Up</button>{" "}
    </form>
  );
}
export default SignupPage;
