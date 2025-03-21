import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableForm from "../components/TablesPage/TableForm";
import TableList from "../components/TablesPage/TableList";
import '../styles/TablesPage.css';
import API from "../../../utils/auth-interceptor"; // Using the API with interceptors

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchTables();
  }, []);
  
  const fetchTables = async () => {
    try {
      setLoading(true);
      
      const user = JSON.parse(localStorage.getItem("user")); // Retrieve stored user
      if (!user?.restaurantId) {
        throw new Error("Restaurant ID not found. Please log in again.");
      }
      
      const response = await API.get(`/tables?restaurantId=${user.restaurantId}`);
      setTables(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tables");
      console.error("Error fetching tables:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const createTable = async (name, tableNumber) => {
    try {
      const response = await API.post("/tables", { name, tableNumber });
      setTables([...tables, response.data]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create table");
      console.error("Error creating table:", err);
    }
  };
  
  const deleteTable = async (id) => {
    try {
      await API.delete(`/tables/${id}`);
      setTables(tables.filter((table) => table._id !== id));
    } catch (err) {
      setError("Failed to delete table");
      console.error("Error deleting table:", err);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      
      // Call the logout endpoint
      await API.post("/auth/logout", { refreshToken });
      
      // Clear all localStorage items
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if the server request fails, clear tokens and redirect
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };
  
  if (loading) return <div>Loading tables...</div>;
  
  return (
    <div className="tables-page">
      <h1>Restaurant Tables</h1>
      {error && <p className="error">{error}</p>}
      
      <div className="header-actions">
        <div className="user-info">
          {JSON.parse(localStorage.getItem("user"))?.firstname && (
            <p>Welcome, {JSON.parse(localStorage.getItem("user")).firstname}</p>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      
      <div className="actions">
        <button onClick={() => navigate("/menu-management")} className="menu-button bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Manage Menu
        </button>
      </div>
      
      <div className="navigation">
        <button onClick={() => navigate("/dashboard")} className="dashboard-button">
          View Dashboard
        </button>
        <button onClick={() => navigate("/restaurant")}>See Restaurants</button>
        <button onClick={() => navigate("/waiters")}>See Waiters</button>
      </div>
      
      <TableForm createTable={createTable} />
      <TableList
        tables={tables}
        deleteTable={deleteTable}
        updateTables={fetchTables}
      />
    </div>
  );
};

export default TablesPage;