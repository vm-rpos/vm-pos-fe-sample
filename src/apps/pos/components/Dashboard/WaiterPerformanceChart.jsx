import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const WaiterPerformanceChart = ({ waitersData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Check if we have data and a canvas reference
    if (!waitersData || waitersData.length === 0 || !chartRef.current) {
      return;
    }

    // Destroy existing chart before creating a new one
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Filter out waiters with no orders or revenue
    const validWaiters = waitersData.filter(waiter => 
      waiter && waiter.revenue > 0 && waiter.ordersCount > 0 && waiter.name
    );

    // Sort waiters by revenue and get top 10
    const topWaiters = [...validWaiters]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // If no valid waiters remain, don't try to create a chart
    if (topWaiters.length === 0) {
      return;
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Create the chart
    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topWaiters.map(waiter => waiter.name),
        datasets: [
          {
            label: 'Revenue Generated (₹)',
            data: topWaiters.map(waiter => waiter.revenue),
            backgroundColor: 'rgba(153, 102, 255, 0.7)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Orders Served',
            data: topWaiters.map(waiter => waiter.ordersCount),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            yAxisID: 'y1'
          },
          {
            label: 'Items Served',
            data: topWaiters.map(waiter => waiter.itemsServed),
            backgroundColor: 'rgba(255, 206, 86, 0.7)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Top 10 Waiter Performance',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.datasetIndex === 0) {
                  label += '₹' + context.raw.toFixed(2);
                } else {
                  label += context.raw;
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Waiters',
              font: {
                size: 14
              }
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Revenue (₹)',
              font: {
                size: 14
              }
            },
            ticks: {
              callback: function(value) {
                return '₹' + value.toFixed(0);
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Count',
              font: {
                size: 14
              }
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });

    // Cleanup function to destroy chart when unmounting
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [waitersData]);

  return (
    <div className="dashboard-card">
      <div className="chart-wrapper" style={{ height: "400px", width: "100%" }}>
        <canvas ref={chartRef}></canvas>
      </div>
      {(!waitersData || waitersData.length === 0) && (
        <div className="no-data-message">No waiter data available</div>
      )}
    </div>
  );
};

export default WaiterPerformanceChart;