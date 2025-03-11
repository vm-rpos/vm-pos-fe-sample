import React from 'react';

const StatsCards = ({ analyticsData }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <h3>Total Revenue</h3>
        <p className="stat-value">₹{analyticsData.totalRevenue.toFixed(2)}</p>
      </div>
      <div className="stat-card">
        <h3>Total Orders</h3>
        <p className="stat-value">{analyticsData.totalOrders}</p>
      </div>
      <div className="stat-card">
        <h3>Total Items Sold</h3>
        <p className="stat-value">{analyticsData.totalItems}</p>
      </div>
    </div>
  );
};

export default StatsCards;
