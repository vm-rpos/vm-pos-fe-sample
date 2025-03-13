import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardHeader from '../components/Dashboard/DashboardHeader.jsx';
import StatsCards from '../components/Dashboard/StatsCards.jsx';
import DataTable from '../components/Dashboard/DataTable.jsx';
import OrdersTable from '../components/Dashboard/OrdersTable.jsx'; // Add this import

const Dashboard = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all');
  const [orders, setOrders] = useState([]); // Add this state

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/analytics');
      setAnalyticsData(response.data);
      
      // Also fetch orders
      const ordersResponse = await axios.get('http://localhost:5000/api/orders');
      
      // Sort orders by total price (high to low)
      const sortedOrders = ordersResponse.data.sort((a, b) => b.total - a.total);
      setOrders(sortedOrders);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!analyticsData) return <div className="error">No data available</div>;

  return (
    <div className="dashboard-container">
      <h1>Restaurant Dashboard</h1>

      <DashboardHeader timeRange={timeRange} setTimeRange={setTimeRange} fetchAnalytics={fetchAnalytics} />
      <StatsCards analyticsData={analyticsData} />

      {/* Add Orders Table at the top */}
      <OrdersTable orders={orders} />

      <div className="dashboard-grid">
        <DataTable
          title="Most Popular Items"
          columns={['Item', 'Quantity Sold', 'Revenue']}
          data={analyticsData.popularItems.map(item => ({
            name: item.name,
            count: item.count,
            revenue: item.revenue,
          }))}
        />

        <DataTable
          title="Highest Revenue Items"
          columns={['Item', 'Revenue', 'Quantity Sold']}
          data={analyticsData.topRevenue.map(item => ({
            name: item.name,
            revenue: item.revenue,
            count: item.count,
          }))}
        />

        <DataTable
          title="Revenue by Category"
          columns={['Category', 'Revenue']}
          data={analyticsData.categoryData.map(category => ({
            category: category.category,
            revenue: category.revenue,
          }))}
        />

        <DataTable
          title="Table Performance"
          columns={['Table', 'Items Sold', 'Revenue']}
          data={analyticsData.tableUsage
            .sort((a, b) => b.revenue - a.revenue)
            .map(table => ({
              table: `Table ${table.tableNumber} (${table.name})`,
              totalItems: table.totalItems,
              revenue: table.revenue,
            }))}
        />
      </div>

      <div className="navigation">
        <button onClick={() => navigate('/')}>Back to Tables</button>
        <button onClick={() => navigate('/menu-management')}>Manage Menu</button>
      </div>
    </div>
  );
};

export default Dashboard;