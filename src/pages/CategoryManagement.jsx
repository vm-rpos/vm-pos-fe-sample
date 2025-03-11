import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryList from '../components/CategoryManagement/CategoryList';
import ItemList from '../components/CategoryManagement/ItemList';
import CategoryForm from '../components/CategoryManagement/CategoryForm';
import ItemForm from '../components/CategoryManagement/ItemForm';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name) => {
    try {
      const response = await axios.post('http://localhost:5000/api/categories', { name });
      setCategories([...categories, response.data]);
    } catch (err) {
      setError('Failed to add category');
    }
  };

  const updateCategory = async (id, name) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/categories/${id}`, { name });
      setCategories(categories.map(cat => (cat._id === id ? response.data : cat)));
      if (selectedCategory?._id === id) setSelectedCategory(response.data);
    } catch (err) {
      setError('Failed to update category');
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
      if (selectedCategory?._id === id) setSelectedCategory(null);
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const addItem = async (name, price) => {
    if (!selectedCategory) return;
    try {
      const response = await axios.post(`http://localhost:5000/api/categories/${selectedCategory._id}/items`, {
        name,
        price: parseFloat(price),
      });

      setCategories(categories.map(cat => (cat._id === selectedCategory._id ? response.data : cat)));
      setSelectedCategory(response.data);
    } catch (err) {
      setError('Failed to add item');
    }
  };

  return (
    <div>
      <h1>Menu Management</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <CategoryForm addCategory={addCategory} />
      <CategoryList
        categories={categories}
        onEdit={updateCategory}
        onDelete={deleteCategory}
        onSelect={setSelectedCategory}
      />

      {selectedCategory && (
        <>
          <ItemForm addItem={addItem} />
          <ItemList category={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </>
      )}
    </div>
  );
};

export default CategoryManagement;
