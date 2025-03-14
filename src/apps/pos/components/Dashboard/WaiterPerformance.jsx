import React from 'react';

const WaiterPerformance = ({ waitersData }) => {
  return (
    <div className="dashboard-card">
      <h2>Waiter Performance</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Waiter</th>
            <th>Orders Served</th>
            <th>Items Served</th>
            <th>Revenue Generated</th>
            <th>Average Order Value</th>
          </tr>
        </thead>
        <tbody>
          {waitersData.length > 0 ? (
            waitersData.map((waiter, index) => (
              <tr key={index}>
                <td>{waiter.name}</td>
                <td>{waiter.ordersCount}</td>
                <td>{waiter.itemsServed}</td>
                <td>₹{waiter.revenue.toFixed(2)}</td>
                <td>₹{(waiter.revenue / waiter.ordersCount).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No waiter data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WaiterPerformance;