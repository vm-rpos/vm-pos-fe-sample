import React, { useState } from 'react';

const ItemForm = ({ addItem }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return;
    addItem(name, price);
    setName('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Item price" />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default ItemForm;
