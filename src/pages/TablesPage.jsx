import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableForm from "../components/TablesPage/TableForm";
import TableList from "../components/TablesPage/TableList";

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
      const response = await axios.get("http://localhost:5000/api/tables");
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
      const response = await axios.post("http://localhost:5000/api/tables", {
        name,
        tableNumber: parseInt(tableNumber),
      });
      setTables([...tables, response.data]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create table");
      console.error("Error creating table:", err);
    }
  };

  const deleteTable = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tables/${id}`);
      setTables(tables.filter((table) => table._id !== id));
    } catch (err) {
      setError("Failed to delete table");
      console.error("Error deleting table:", err);
    }
  };

  if (loading) return <div>Loading tables...</div>;

  return (
    <div className="tables-page">
      <h1>Restaurant Tables</h1>
      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button onClick={() => navigate("/menu-management")} className="menu-button">
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