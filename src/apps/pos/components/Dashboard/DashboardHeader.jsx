import React from 'react';

const DashboardHeader = ({ timeRange, setTimeRange, fetchAnalytics }) => {
  return (
    <div className="dashboard-header">
      <div className="time-filter">
        <label>Time Range:</label>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        
        {timeRange !== 'all' && (
          <span className="time-range-indicator">
            Showing data for: <strong>{timeRange === 'today' ? 'Today' : 
              timeRange === 'week' ? 'This Week' : 'This Month'}</strong>
          </span>
        )}
      </div>
      <button className="refresh-button" onClick={fetchAnalytics}>
        Refresh Data
      </button>
    </div>
  );
};

export default DashboardHeader;