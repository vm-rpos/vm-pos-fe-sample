import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import WaiterPerformanceChart from './WaiterPerformanceChart';

const OrderCharts = ({ analyticsData, timeRange, orders }) => {
  const hourlyChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  
  // Clear existing charts to prevent memory leaks
  const destroyCharts = () => {
    if (hourlyChartRef.current?.chartInstance) {
      hourlyChartRef.current.chartInstance.destroy();
    }
    if (revenueChartRef.current?.chartInstance) {
      revenueChartRef.current.chartInstance.destroy();
    }
    if (categoryChartRef.current?.chartInstance) {
      categoryChartRef.current.chartInstance.destroy();
    }
  };

  useEffect(() => {
    // Return early if no orders data
    if (!orders || orders.length === 0) return;
    
    // Destroy any existing charts
    destroyCharts();
    
    // Process data for hourly chart (items ordered by hour for today)
    createHourlyOrdersChart();
    
    // Create revenue by category chart
    createCategoryRevenueChart();
    
    // Create popular items chart
    createPopularItemsChart();
    
    // Clean up on component unmount
    return () => {
      destroyCharts();
    };
  }, [analyticsData, timeRange, orders]);

  const createHourlyOrdersChart = () => {
    if (!hourlyChartRef.current) return;
    
    let chartData;
    let chartTitle;
    
    if (timeRange === 'today') {
      // For today - show hourly breakdown
      const hourlyData = Array(24).fill(0); // 24 hours
      
      orders.forEach(order => {
        const orderTime = new Date(order.createdAt);
        const hour = orderTime.getHours();
        
        // Count total items in this order
        const totalItems = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        hourlyData[hour] += totalItems;
      });
      
      chartData = {
        labels: Array(24).fill().map((_, i) => {
          // Format as 12-hour time (1 AM, 2 PM, etc.)
          return `${i % 12 === 0 ? 12 : i % 12}${i < 12 ? ' AM' : ' PM'}`;
        }),
        datasets: [{
          label: 'Items Ordered',
          data: hourlyData,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };
      chartTitle = 'Items Ordered by Hour (Today)';
    } else if (timeRange === 'week') {
      // For week - show daily breakdown
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dailyData = Array(7).fill(0); // 7 days
      
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const dayOfWeek = orderDate.getDay(); // 0-6
        
        // Count total items in this order
        const totalItems = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        dailyData[dayOfWeek] += totalItems;
      });
      
      chartData = {
        labels: daysOfWeek,
        datasets: [{
          label: 'Items Ordered',
          data: dailyData,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };
      chartTitle = 'Items Ordered by Day (This Week)';
    } else if (timeRange === 'month') {
      // For month - group by day of month
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const dailyData = Array(daysInMonth).fill(0);
      
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const dayOfMonth = orderDate.getDate() - 1; // 0-indexed array
        
        // Count total items in this order
        const totalItems = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        dailyData[dayOfMonth] += totalItems;
      });
      
      chartData = {
        labels: Array(daysInMonth).fill().map((_, i) => `Day ${i + 1}`),
        datasets: [{
          label: 'Items Ordered',
          data: dailyData,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };
      chartTitle = 'Items Ordered by Day (This Month)';
    } else {
      // For all time - group by month
      const monthlyData = {};
      
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const monthYear = `${orderDate.toLocaleString('default', { month: 'short' })} ${orderDate.getFullYear()}`;
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = 0;
        }
        
        // Count total items in this order
        const totalItems = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        monthlyData[monthYear] += totalItems;
      });
      
      // Convert to array sorted by date
      const months = Object.keys(monthlyData);
      const sortedMonths = months.sort((a, b) => {
        const [aMonth, aYear] = a.split(' ');
        const [bMonth, bYear] = b.split(' ');
        return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
      });
      
      chartData = {
        labels: sortedMonths,
        datasets: [{
          label: 'Items Ordered',
          data: sortedMonths.map(month => monthlyData[month]),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };
      chartTitle = 'Items Ordered by Month (All Time)';
    }
    
    const ctx = hourlyChartRef.current.getContext('2d');
    hourlyChartRef.current.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: chartTitle,
            font: {
              size: 16
            }
          },
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Items',
              font: {
                size: 14
              }
            }
          },
          x: {
            title: {
              display: true,
              text: timeRange === 'today' ? 'Hour' : 
                    timeRange === 'week' ? 'Day of Week' : 
                    timeRange === 'month' ? 'Day of Month' : 'Month',
              font: {
                size: 14
              }
            }
          }
        }
      }
    });
  };

  const createCategoryRevenueChart = () => {
    if (!revenueChartRef.current || !analyticsData.categoryData) return;
    
    // Get top 5 categories by revenue
    const topCategories = analyticsData.categoryData.slice(0, 5);
    
    const ctx = revenueChartRef.current.getContext('2d');
    revenueChartRef.current.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topCategories.map(cat => cat.category),
        datasets: [{
          label: 'Revenue (₹)',
          data: topCategories.map(cat => cat.revenue),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Top Categories by Revenue',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue (₹)',
              font: {
                size: 14
              }
            },
            ticks: {
              callback: function(value) {
                return '₹' + value.toFixed(2);
              }
            }
          }
        }
      }
    });
  };

  const createPopularItemsChart = () => {
    if (!categoryChartRef.current || !analyticsData.popularItems) return;
    
    // Get top 5 popular items
    const topItems = analyticsData.popularItems.slice(0, 5);
    
    const ctx = categoryChartRef.current.getContext('2d');
    categoryChartRef.current.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topItems.map(item => item.name),
        datasets: [{
          label: 'Items Sold',
          data: topItems.map(item => item.count),
          backgroundColor: 'rgba(255, 159, 64, 0.7)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Top 5 Most Popular Items',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantity Sold',
              font: {
                size: 14
              }
            }
          }
        }
      }
    });
  };

  return (
    <div className="charts-container">
      <div className="chart-wrapper">
        <canvas ref={hourlyChartRef} height="300"></canvas>
      </div>
      
      {/* Add Waiter Performance Chart */}
      {analyticsData.waitersData && analyticsData.waitersData.length > 0 && (
        <WaiterPerformanceChart waitersData={analyticsData.waitersData} />
      )}
      
      <div className="chart-row">
        <div className="chart-wrapper half">
          <canvas ref={categoryChartRef} height="300"></canvas>
        </div>
        <div className="chart-wrapper half">
          <canvas ref={revenueChartRef} height="300"></canvas>
        </div>
      </div>
    </div>
  );
};

export default OrderCharts;