import React from 'react';

const WaiterPerformance = ({ waitersData }) => {
  // Filter out waiters with no orders or no revenue
  const activeWaiters = waitersData.filter(waiter => 
    waiter.ordersCount > 0 && waiter.revenue > 0
  );

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
          {activeWaiters.length > 0 ? (
            activeWaiters.map((waiter, index) => (
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