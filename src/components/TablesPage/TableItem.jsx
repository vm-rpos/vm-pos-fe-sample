import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TableItem = ({ table, deleteTable, updateTables }) => {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(table.name);
  const [error, setError] = useState(null);

  const handleEdit = async () => {
    if (editing) {
      try {
        // If we're currently editing, save the changes
        if (newName.trim() === '') {
          setError("Table name cannot be empty");
          return;
        }

        const response = await axios.put(`http://localhost:5000/api/tables/${table._id}`, {
          name: newName
        });

        // Update succeeded
        setError(null);
        setEditing(false);
        
        // Call parent component function to refresh the table list
        if (updateTables) updateTables();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update table");
        console.error("Error updating table:", err);
      }
    } else {
      // If we're not editing, start editing
      setEditing(true);
    }
  };

  return (
    <li key={table._id} className={table.hasOrders ? "served" : "available"}>
      {editing ? (
        <>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new table name"
          />
          {error && <div className="error-message">{error}</div>}
        </>
      ) : (
        <Link to={`/table/${table._id}`}>
          {table.name} {table.tableNumber} - {table.hasOrders ? "Served" : "Available"}
        </Link>
      )}
      <div className="table-actions">
        <button 
          onClick={handleEdit}
          className="edit-button"
        >
          {editing ? "Save" : "Edit"}
        </button>
        {editing && (
          <button 
            onClick={() => {
              setEditing(false);
              setNewName(table.name);
            }}
            className="cancel-button"
          >
            Cancel
          </button>
        )}
        <button 
          onClick={() => deleteTable(table._id)}
          className="delete-button"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TableItem;