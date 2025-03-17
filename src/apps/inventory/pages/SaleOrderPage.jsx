import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const API_BASE_URL = "http://localhost:5000/api-ivm/ivmorders";

const SaleOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [destination, setDestination] = useState('');
  const [items, setItems] = useState([]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}?orderType=saleOrder`);
      setOrders(response.data);
    } catch (error) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleEdit = (order) => {
    setEditMode(true);
    setCurrentOrder(order);
    setDestination(order.destination);
    setItems(order.items);
    setExpectedDeliveryDate(format(new Date(order.expectedDeliveryDate), 'yyyy-MM-dd'));
    setStatus(order.status);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentOrder(null);
    resetForm();
  };

  const resetForm = () => {
    setDestination('');
    setItems([]);
    setExpectedDeliveryDate('');
    setStatus('');
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${orderId}`);
        setOrders(orders.filter(order => order._id !== orderId));
      } catch (error) {
        setError('Failed to delete order');
        console.error('Error deleting order:', error);
      }
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!destination || items.length === 0 || !expectedDeliveryDate || !status) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        destination,
        items,
        expectedDeliveryDate: new Date(expectedDeliveryDate).toISOString(),
        status,
        orderType: 'saleOrder'
      };

      const response = await axios.put(`${API_BASE_URL}/${currentOrder._id}`, orderData);
      
      setOrders(orders.map(order => 
        order._id === currentOrder._id ? response.data : order
      ));
      
      setEditMode(false);
      resetForm();
    } catch (error) {
      setError("Failed to update order");
      console.error('Error updating order:', error);
    }
    setLoading(false);
  };

  // Handle item changes in the edit form
  const updateItemQuantity = (index, quantity) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], quantity: Number(quantity) };
    setItems(updatedItems);
  };

  return (
    <div>
      <h2>Sale Orders</h2>
      {error && (
        <div style={{ color: 'red' }}>{error}</div>
      )}

      {editMode && currentOrder && (
        <div>
          <h3>Edit Sale Order</h3>
          <form onSubmit={handleSubmitEdit}>
            <div>
              <label>Destination:</label>
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label>Items:</label>
              {items.map((item, index) => (
                <div key={index}>
                  <span>{item.name}</span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItemQuantity(index, e.target.value)}
                    min="1"
                    required
                  />
                </div>
              ))}
            </div>

            <div>
              <label>Expected Delivery Date:</label>
              <input 
                type="date" 
                value={expectedDeliveryDate} 
                onChange={(e) => setExpectedDeliveryDate(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label>Status:</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                required
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Order'}
            </button>
            <button type="button" onClick={handleCancelEdit}>Cancel</button>
          </form>
        </div>
      )}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Destination</th>
                <th>Items</th>
                <th>Expected Delivery</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.destination}</td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.name} - {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>{formatDate(order.expectedDeliveryDate)}</td>
                  <td>{order.status}</td>
                  <td>
                    <button onClick={() => handleEdit(order)}>Edit</button>
                    <button onClick={() => handleDelete(order._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SaleOrderPage;