import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [pinForm, setPinForm] = useState({ userId: "", pin: "" });
  const [showPinInput, setShowPinInput] = useState(false);
  const navigate = useNavigate();
  
  // Check if user already has a refresh token on page load
  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("Initial refresh token check:", refreshToken ? "Token exists" : "No token");
    
    if (refreshToken) {
      console.log("Attempting to refresh with token:", refreshToken.substring(0, 10) + "...");
      handleTokenRefresh(refreshToken);
    }
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handlePinChange = (e) => {
    setPinForm({ ...pinForm, [e.target.name]: e.target.value });
  };
  
  // Refresh token function
  const handleTokenRefresh = async (refreshToken) => {
    try {
      console.log("Refreshing token - sending request to backend");
      const response = await axios.post("http://localhost:5000/api/auth/refresh-token", {
        refreshToken
      });
      
      console.log("Token refresh successful");
      console.log("New access token received:", response.data.accessToken.substring(0, 10) + "...");
      console.log("PIN required:", response.data.requirePin);
      
      // Store new access token
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // If PIN is required after token refresh
      if (response.data.requirePin) {
        console.log("PIN verification needed after refresh. User ID:", response.data.user._id);
        setPinForm({ userId: response.data.user._id, pin: "" });
        setShowPinInput(true);
      } else {
        // Token refreshed and no PIN required, navigate to home
        console.log("No PIN needed, navigating to home page");
        navigate("/");
      }
    } catch (error) {
      console.error("Token refresh failed:", error.response?.data || error.message);
      // If refresh token is invalid, go back to login screen
      console.log("Clearing all tokens due to refresh failure");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setShowPinInput(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Login attempt with email:", formData.email);
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      
      console.log("Login successful");
      console.log("Access token received:", response.data.accessToken.substring(0, 10) + "...");
      console.log("Refresh token received:", response.data.refreshToken.substring(0, 10) + "...");
      
      // Store both tokens and user data
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Show PIN input if required
      if (response.data.requirePin) {
        console.log("PIN verification needed. User ID:", response.data.user._id);
        setPinForm({ userId: response.data.user._id, pin: "" });
        setShowPinInput(true);
      } else {
        console.log("No PIN needed, navigating to home page");
        alert("Login successful!");
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Login failed");
    }
  };
  
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Verifying PIN for user:", pinForm.userId);
      const response = await axios.post("http://localhost:5000/api/auth/verify-pin", pinForm);
      
      console.log("PIN verification successful");
      console.log("New access token received after PIN verification:", 
        response.data.accessToken.substring(0, 10) + "...");
      
      // Update access token after PIN verification
      localStorage.setItem("accessToken", response.data.accessToken);
      
      alert("PIN verified successfully!");
      console.log("Navigating to home page after PIN verification");
      navigate("/");
    } catch (error) {
      console.error("PIN verification failed:", error.response?.data || error.message);
      alert(error.response?.data?.error || "PIN verification failed");
    }
  };
  
  // Show PIN input form if needed
  if (showPinInput) {
    return (
      <div>
        <h2>Enter PIN</h2>
        <form onSubmit={handlePinSubmit}>
          <input 
            type="password" 
            name="pin" 
            placeholder="4-digit PIN" 
            maxLength="4" 
            value={pinForm.pin}
            onChange={handlePinChange} 
            required 
          />
          <button type="submit">Verify PIN</button>
        </form>
      </div>
    );
  }
  
  // Regular login form
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email}
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password}
          onChange={handleChange} 
          required 
        />
        <button type="submit">Login</button>
      </form>
      <a href="/signup">Don't have an account then signup here</a> <br></br>
    </>
  );
}

export default LoginPage;