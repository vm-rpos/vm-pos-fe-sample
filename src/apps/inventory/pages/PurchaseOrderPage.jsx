import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const API_BASE_URL = "http://localhost:5000/api-ivm/ivmorders";
const VENDOR_API_URL = "http://localhost:5000/api-ivm/vendors";
const ITEM_API_URL = "http://localhost:5000/api-ivm/items";

const PurchaseOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [vendorId, setVendorId] = useState('');
  const [orderItems, setOrderItems] = useState([{ itemId: '', quantity: 1 }]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [status, setStatus] = useState('order successful');

  useEffect(() => {
    fetchOrders();
    fetchVendors();
    fetchItems();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/type/purchaseOrder`);
      setOrders(response.data);
    } catch (error) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get(VENDOR_API_URL);
      setVendors(response.data);
    } catch (error) {
      setError('Failed to load vendors');
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(ITEM_API_URL);
      setItems(response.data);
    } catch (error) {
      setError('Failed to load items');
      console.error('Error fetching items:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleEdit = (orderId) => {
    const orderToEdit = orders.find(order => order._id === orderId);
    if (orderToEdit) {
      setVendorId(orderToEdit.vendorId ? orderToEdit.vendorId._id : '');
      setOrderItems(orderToEdit.items.map(item => ({ 
        itemId: item.itemId ? item.itemId._id : '', 
        quantity: item.quantity 
      })));
      setExpectedDeliveryDate(orderToEdit.expectedDeliveryDate.split('T')[0]);
      setStatus(orderToEdit.status || 'order successful');
      setIsEditing(true);
      setCurrentOrderId(orderId);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      setError('Failed to delete order');
      console.error('Error deleting order:', error);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'quantity' ? (value === '' ? '' : Number(value)) : value
    };
    setOrderItems(updatedItems);
  };

  const addItemRow = () => {
    setOrderItems([...orderItems, { itemId: '', quantity: 1 }]);
  };

  const removeItemRow = (index) => {
    if (orderItems.length > 1) {
      const updatedItems = [...orderItems];
      updatedItems.splice(index, 1);
      setOrderItems(updatedItems);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!vendorId) {
        throw new Error("Vendor is required for purchase orders!");
      }

      if (!expectedDeliveryDate) {
        throw new Error("Expected delivery date is required!");
      }

      if (orderItems.some(item => !item.itemId || !item.quantity)) {
        throw new Error("All items must have an item and quantity selected!");
      }

      const formattedItems = await Promise.all(orderItems.map(async (orderItem) => {
        const itemDetails = items.find(item => item._id === orderItem.itemId);
        if (!itemDetails) {
          throw new Error(`Item details not found for item ID: ${orderItem.itemId}`);
        }
        return {
          itemId: orderItem.itemId,
          name: itemDetails.name,
          quantity: Number(orderItem.quantity),
          price: itemDetails.price || 0
        };
      }));

      const orderData = {
        orderType: 'purchaseOrder',
        vendorId,
        items: formattedItems,
        expectedDeliveryDate: new Date(expectedDeliveryDate).toISOString(),
        status
      };

      const response = await axios.put(`${API_BASE_URL}/${currentOrderId}`, orderData);
      setOrders(orders.map(order => order._id === currentOrderId ? response.data : order));
      resetForm();
    } catch (error) {
      console.error('Error updating order:', error);
      setError(error.response?.data?.message || error.message || 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVendorId('');
    setOrderItems([{ itemId: '', quantity: 1 }]);
    setExpectedDeliveryDate('');
    setStatus('order successful');
    setIsEditing(false);
    setCurrentOrderId(null);
  };

  return (
    <div>
      <h2>Purchase Orders</h2>
      {error && (
        <div>{error}</div>
      )}

      {isEditing && (
        <div>
          <h3>Edit Purchase Order</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Vendor:</label>
              <select 
                value={vendorId} 
                onChange={(e) => setVendorId(e.target.value)} 
                required
              >
                <option value="">Select a vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>{vendor.name}</option>
                ))}
              </select>
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
                <option value="order successful">Order Successful</option>
                <option value="in transit">In Transit</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div>
              <h4>Items</h4>
              {orderItems.map((item, index) => (
                <div key={index}>
                  <div>
                    <label>Item:</label>
                    <select 
                      value={item.itemId} 
                      onChange={(e) => handleItemChange(index, 'itemId', e.target.value)} 
                      required
                    >
                      <option value="">Select an item</option>
                      {items.map((itemOption) => (
                        <option key={itemOption._id} value={itemOption._id}>
                          {itemOption.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label>Quantity:</label>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                      min="1" 
                      required 
                    />
                  </div>

                  <button 
                    type="button" 
                    onClick={() => removeItemRow(index)}
                    disabled={orderItems.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button 
                type="button" 
                onClick={addItemRow}
              >
                Add Item
              </button>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Order'}
              </button>
              <button 
                type="button" 
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
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
                <th>Vendor</th>
                <th>Items</th>
                <th>Expected Delivery</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.vendorId ? order.vendorId.name : ''}</td>
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
                    <button onClick={() => handleEdit(order._id)}>Edit</button>
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

export default PurchaseOrderPage;