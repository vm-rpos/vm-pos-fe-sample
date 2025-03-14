import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const WaiterPerformanceChart = ({ waitersData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!waitersData || waitersData.length === 0 || !chartRef.current) return;

    // Destroy existing chart
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    // Get top 10 waiters by revenue
    const topWaiters = waitersData.slice(0, 10);
    
    const ctx = chartRef.current.getContext('2d');
    chartRef.current.chartInstance = new Chart(ctx, {
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
            text: 'Waiter Performance',
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
            grid: {
              drawOnChartArea: false
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
              text: 'Items Served',
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

    return () => {
      if (chartRef.current?.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, [waitersData]);

  return (
    <div className="chart-wrapper">
      <canvas ref={chartRef} height="300"></canvas>
    </div>
  );
};

export default WaiterPerformanceChart;