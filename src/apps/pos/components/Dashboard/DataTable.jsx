import React, { useState } from "react";

const DataTable = ({ title, columns, data }) => {
  const [sortOrder, setSortOrder] = useState("high-to-low");

  // Sort data dynamically based on revenue
  const sortedData = [...data].sort((a, b) =>
    sortOrder === "high-to-low" ? b.revenue - a.revenue : a.revenue - b.revenue
  );

  return (
    <div className="dashboard-card">
      <div className="table-header">
        <h2>{title}</h2>
        {title === "Table Performance" && (
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-dropdown"
          >
            <option value="high-to-low">High to Low</option>
            <option value="low-to-high">Low to High</option>
          </select>
        )}
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, index) => (
              <tr key={index}>
                {Object.keys(row).map((key, i) => {
                  const value = row[key];
                  if (key === "revenue") {
                    return <td key={i}>₹{value.toFixed(2)}</td>;
                  } else {
                    return <td key={i}>{value}</td>;
                  }
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
