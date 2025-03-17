import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const API_BASE_URL = "http://localhost:5000/api-ivm/purchaseorders";
const VENDOR_API_URL = "http://localhost:5000/api-ivm/vendors";
const ITEM_API_URL = "http://localhost:5000/api-ivm/items";

const PurchaseOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchVendors();
    fetchItems();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setOrders(response.data);
    } catch (error) {
      setError('Failed to load orders');
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get(VENDOR_API_URL);
      setVendors(response.data);
    } catch (error) {
      setError('Failed to load vendors');
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(ITEM_API_URL);
      setItems(response.data);
    } catch (error) {
      setError('Failed to load items');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!vendorId || !itemId || !quantity || !expectedDeliveryDate) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const orderData = { 
        vendorId, 
        itemId, 
        quantity: Number(quantity), 
        expectedDeliveryDate: new Date(expectedDeliveryDate).toISOString()
      };

      const response = await axios.post(API_BASE_URL, orderData);
      setOrders([...orders, response.data]);
      resetForm();
    } catch (error) {
      setError("Failed to create order");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setVendorId('');
    setItemId('');
    setQuantity('');
    setExpectedDeliveryDate('');
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div>
      <h2>Purchase Orders</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        <h3>Create New Order</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Vendor:</label>
            <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} required>
              <option value="">Select a vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>{vendor.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Item:</label>
            <select value={itemId} onChange={(e) => setItemId(e.target.value)} required>
              <option value="">Select an item</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Quantity:</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" required />
          </div>

          <div>
            <label>Expected Delivery Date:</label>
            <input type="date" value={expectedDeliveryDate} onChange={(e) => setExpectedDeliveryDate(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </form>
      </div>

      <div>
        <h3>Existing Orders</h3>
        {orders.length === 0 ? (
          <p>No purchase orders found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Expected Delivery</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.vendorId?.name || 'Unknown vendor'}</td>
                  <td>{order.itemId?.name || 'Unknown item'}</td>
                  <td>{order.quantity}</td>
                  <td>{formatDate(order.expectedDeliveryDate)}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderPage;