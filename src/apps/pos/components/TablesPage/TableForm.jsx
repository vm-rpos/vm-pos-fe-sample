import React, { useState } from "react";

const TableForm = ({ createTable }) => {
  const [newTableName, setNewTableName] = useState("");
  const [newTableNumber, setNewTableNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTableName.trim() || !newTableNumber) return;
    createTable(newTableName, newTableNumber);
    setNewTableName("");
    setNewTableNumber("");
  };

  return (
    <form onSubmit={handleSubmit} className="table-form">
      <input
        type="text"
        value={newTableName}
        onChange={(e) => setNewTableName(e.target.value)}
        placeholder="Enter table name"
      />
      <input
        type="number"
        value={newTableNumber}
        onChange={(e) => setNewTableNumber(e.target.value)}
        placeholder="Enter table number"
      />
      <button type="submit" className="text-4xl font-bold text-blue-600">
        Create Table
      </button>
    </form>
  );
};

export default TableForm;
