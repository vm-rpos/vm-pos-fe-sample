import React from 'react';

const DataTable = ({ title, columns, data }) => {
  return (
    <div className="dashboard-card">
      <h2>{title}</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index}>
                {Object.keys(row).map((key, i) => {
                  const value = row[key];
                  // Check if this column should be formatted as currency or quantity
                  if (key === 'revenue' || key === 'total' || key === 'price') {
                    return <td key={i}>₹{typeof value === 'number' ? value.toFixed(2) : value}</td>;
                  } else if (key === 'quantity' || key === 'count' || key === 'totalItems') {
                    return <td key={i}>{value}</td>; // No currency symbol for quantities
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