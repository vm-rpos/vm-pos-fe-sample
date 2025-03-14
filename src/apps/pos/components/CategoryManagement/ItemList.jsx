import React, { useState } from 'react';
import axios from 'axios';

const ItemList = ({ category, setSelectedCategory }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const startEditing = (item) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditPrice(item.price);
  };

  const updateItem = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/categories/${category._id}/items/${editingItem._id}`, {
        name: editName,
        price: parseFloat(editPrice),
      });

      setSelectedCategory(response.data);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update item');
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${category._id}/items/${itemId}`);
      setSelectedCategory({
        ...category,
        items: category.items.filter(item => item._id !== itemId),
      });
    } catch (error) {
      console.error('Failed to delete item');
    }
  };

  return (
    <ul>
      {category.items?.map(item => (
        <li key={item._id}>
          {editingItem?._id === item._id ? (
            <>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
              <input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
              <button onClick={updateItem}>Save</button>
              <button onClick={() => setEditingItem(null)}>Cancel</button>
            </>
          ) : (
            <>
              {item.name} - ₹{item.price}
              <button onClick={() => startEditing(item)}>Edit</button>
              <button onClick={() => deleteItem(item._id)}>Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ItemList;
