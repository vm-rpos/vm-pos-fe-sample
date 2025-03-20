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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Purchase Orders
        </h2>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                to="/"
              >
                Home
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">
              Purchase Orders
            </li>
          </ol>
        </nav>
      </div>
  
      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200/10 dark:text-red-400">
          {error}
        </div>
      )}
  
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="px-6 py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            Create New Order
          </h3>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Vendor:
                </label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-white/[0.06] dark:border-white/[0.1] dark:text-white/90"
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
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Item:
                </label>
                <select
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-white/[0.06] dark:border-white/[0.1] dark:text-white/90"
                >
                  <option value="">Select an item</option>
                  {items.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
  
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Quantity:
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-white/[0.06] dark:border-white/[0.1] dark:text-white/90"
                />
              </div>
  
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Expected Delivery Date:
                </label>
                <input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-white/[0.06] dark:border-white/[0.1] dark:text-white/90"
                />
              </div>
            </div>
  
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {loading ? "Creating..." : "Create Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="px-6 py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            Existing Orders
          </h3>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-6 dark:text-gray-400">
              No purchase orders found.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <div className="min-w-full">
                  <table className="w-full">
                    <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                      <tr>
                        <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Vendor
                        </th>
                        <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Item
                        </th>
                        <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Quantity
                        </th>
                        <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Expected Delivery
                        </th>
                        <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {order.vendorId?.name || "Unknown vendor"}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {order.itemId?.name || "Unknown item"}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {order.quantity}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {formatDate(order.expectedDeliveryDate)}
                          </td>
                          <td className="px-4 py-3 text-start">
                            <div
                              className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                                  : order.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
                              }`}
                            >
                              {order.status}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderPage;