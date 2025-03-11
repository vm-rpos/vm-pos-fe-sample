import React from "react";
import { Link } from "react-router-dom";

const TableItem = ({ table, deleteTable }) => {
  return (
    <li key={table._id} className={table.hasOrders ? "served" : "available"}>
      <Link to={`/table/${table._id}`}>
        {table.name} {table.tableNumber} - {table.hasOrders ? "Served" : "Available"}
      </Link>
      <button onClick={() => deleteTable(table._id)}>Delete</button>
    </li>
  );
};

export default TableItem;
