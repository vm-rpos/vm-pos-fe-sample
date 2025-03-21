import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CategoryList from '../components/TableDetailPage/CategoryList';
import MenuItems from '../components/TableDetailPage/MenuItems';
import OrderSummary from '../components/TableDetailPage/OrderSummary';
import '../styles/TableDetailPage.css'

const TableDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [table, setTable] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const tableResponse = await axios.get(`http://localhost:5000/api/tables/${id}`);
  //     setTable(tableResponse.data);
  //     if (tableResponse.data.orders) setSelectedItems(tableResponse.data.orders);
  //     const categoriesResponse = await axios.get('http://localhost:5000/api/categories');
  //     setCategories(categoriesResponse.data);
  //     if (categoriesResponse.data.length > 0) setActiveCategory(categoriesResponse.data[0]);
  //   } catch (err) {
  //     setError('Failed to fetch data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  //Based on RestaurantID
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get restaurantId from localStorage
      const restaurantId = JSON.parse(localStorage.getItem("user"))?.restaurantId;
      if (!restaurantId) {
        setError("Restaurant ID not found");
        return;
      }
      
      // Fetch table with restaurantId as query parameter
      const tableResponse = await axios.get(
        `http://localhost:5000/api/tables/${id}?restaurantId=${restaurantId}`
      );
      setTable(tableResponse.data);
      
      // Set selected items if orders exist
      if (tableResponse.data.orders) setSelectedItems(tableResponse.data.orders);
      
      // Fetch categories with restaurantId
      const categoriesResponse = await axios.get(
        `http://localhost:5000/api/categories?restaurantId=${restaurantId}`
      );
      setCategories(categoriesResponse.data);
      
      // Set active category if categories exist
      if (categoriesResponse.data.length > 0) setActiveCategory(categoriesResponse.data[0]);
      
    } catch (err) {
      setError('Failed to fetch data');
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const updateOrderInDatabase = async (items, waiterId = null) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (!user || !user.restaurantId) {
        throw new Error("Restaurant ID is missing. Please log in again.");
      }
      
      const orderData = {
        orders: items,
      };
      
      if (waiterId) {
        orderData.waiterId = waiterId;
      }
      // No need to include restaurantId in request body as it should come from the token
      
      const response = await axios.post(
        `http://localhost:5000/api/tables/${id}/orders`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setTable(response.data);
    } catch (err) {
      setError('Failed to update order');
      console.error("Order update error:", err);
    }
  };
  

  const handleCategoryChange = (category) => setActiveCategory(category);

  // const addItemToOrder = async (item) => {
  //   const updatedItems = [...selectedItems];
  //   const existingIndex = updatedItems.findIndex((i) => i.name === item.name);
  //   if (existingIndex >= 0) {
  //     updatedItems[existingIndex].quantity += 1;
  //   } else {
  //     updatedItems.push({ ...item, quantity: 1 });
  //   }
  //   setSelectedItems(updatedItems);
  //   await updateOrderInDatabase(updatedItems);
  // };

  const addItemToOrder = async (item) => {
    const updatedItems = [...selectedItems];
    const existingIndex = updatedItems.findIndex((i) => i.itemId === item._id); // ✅ Use itemId instead of name
  
    if (existingIndex >= 0) {
      updatedItems[existingIndex].quantity += 1;
    } else {
      updatedItems.push({
        ...item,
        itemId: item._id, // ✅ Ensure itemId is included
        quantity: 1,
      });
    }
  
    setSelectedItems(updatedItems);
    await updateOrderInDatabase(updatedItems);
  };
  
  const removeItemFromOrder = async (index) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
    await updateOrderInDatabase(updatedItems);
  };

  if (loading) return <div>Loading table details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!table) return <div>Table not found</div>;

  return (
    <div className="table-detail-page">
      <h1>{table.name} (Table {table.tableNumber})</h1>
      <p>Status: {table.hasOrders ? 'Served' : 'Available'}</p>
      <CategoryList 
        categories={categories} 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />
      <MenuItems 
        activeCategory={activeCategory} 
        addItemToOrder={addItemToOrder} 
      />
      <OrderSummary
        selectedItems={selectedItems}
        removeItemFromOrder={removeItemFromOrder}
        updateOrderInDatabase={updateOrderInDatabase}
        navigate={navigate}
      />
    </div>
  );
};

export default TableDetailPage;