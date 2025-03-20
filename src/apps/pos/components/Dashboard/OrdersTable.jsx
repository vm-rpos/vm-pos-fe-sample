import React from "react";
import { format } from "date-fns"; // You'll need to install this package

const OrdersTable = ({ orders }) => {
  return (
    <div className="dashboard-card orders-table">
      <h2>Top 10 Orders</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Table</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}...</td>
                <td>{order.tableName || `Table ${order.tableNumber}`}</td>
                <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                <td>₹{order.total.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>{format(new Date(order.createdAt), "MMM d, h:mm a")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No orders available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
