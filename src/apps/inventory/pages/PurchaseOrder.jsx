import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const API_BASE_URL = "http://localhost:5000/api";

const PurchaseOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Fetch all purchase orders
  useEffect(() => {
    fetchOrders();
    fetchVendors();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/purchaseorders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      setError('Failed to load orders');
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors`);
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setError('Failed to load vendors');
    }
  };

  // Handle new purchase order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!vendorId || !item || !quantity || !expectedDeliveryDate) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }
    
    try {
      // Create the order payload
      const orderData = { 
        vendorId, 
        item, 
        quantity: Number(quantity), 
        expectedDeliveryDate: new Date(expectedDeliveryDate).toISOString()
      };
      
      console.log("Sending order data:", orderData); // Debug log
      
      const response = await axios.post(`${API_BASE_URL}/purchaseorders`, orderData);
      
      setOrders([...orders, response.data]);
      resetForm();
      setLoading(false);
    } catch (error) {
      console.error("Error creating purchase order:", error);
      setError(error.response?.data?.message || "Failed to create order");
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVendorId('');
    setItem('');
    setQuantity('');
    setExpectedDeliveryDate('');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/purchaseorders/${orderId}/status`, { 
        status: newStatus 
      });
      setOrders(orders.map(order => 
        order._id === orderId ? response.data : order
      ));
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'order successful': return 'bg-green-100 text-green-800';
      case 'in transit': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get today's date formatted for the date input
  const getTodayFormatted = () => {
    const today = new Date();
    return format(today, 'yyyy-MM-dd');
  };

  // Default expected delivery date to 7 days from now
  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    setExpectedDeliveryDate(format(defaultDate, 'yyyy-MM-dd'));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Purchase Orders</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Create New Order</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor</label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Select a vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Item Name"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
            <input
              type="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              required
              min={getTodayFormatted()}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </form>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Existing Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Delivery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{order.vendorId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(order.expectedDeliveryDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status || 'order successful'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'order successful')}
                          className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Successful
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'in transit')}
                          className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                        >
                          In Transit
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'delivered')}
                          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Delivered
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderPage;