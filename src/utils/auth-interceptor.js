// auth-interceptor.js
import axios from "axios";

// Create axios instance with default config
const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Add interceptor to handle token expiration automatically
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If token is expired and we haven't tried refreshing yet
    if (error.response?.status === 401 && 
        error.response?.data?.expired === true && 
        !originalRequest._retry) {
      
      console.log("Access token expired. Starting refresh process...");
      originalRequest._retry = true;
      
      try {
        // Get refresh token from storage
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
          console.log("No refresh token found. Redirect to login required.");
          // No refresh token available, redirect to login
          window.location.href = "/login";
          return Promise.reject(error);
        }
        
        console.log("Refreshing token:", refreshToken.substring(0, 10) + "...");
        
        // Get a new access token
        const response = await axios.post("http://localhost:5000/api/auth/refresh-token", {
          refreshToken
        });
        
        console.log("Token refresh successful in interceptor");
        console.log("New access token:", response.data.accessToken.substring(0, 10) + "...");
        
        // Store the new access token
        localStorage.setItem("accessToken", response.data.accessToken);
        
        // If PIN verification is required
        if (response.data.requirePin) {
          console.log("PIN verification required after interceptor refresh. Redirecting to login.");
          // Redirect to login page for PIN verification
          window.location.href = "/login";
          return Promise.reject(error);
        }
        
        // Update the authorization header
        originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
        console.log("Retrying original request with new token");
        
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed in interceptor:", refreshError.response?.data || refreshError.message);
        // If refresh fails, redirect to login
        console.log("Clearing all tokens due to interceptor refresh failure");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Add interceptor to add Authorization header to all requests
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      console.log(`Adding access token to ${config.url} request:`, accessToken.substring(0, 10) + "...");
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      console.log(`No access token available for ${config.url} request`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;