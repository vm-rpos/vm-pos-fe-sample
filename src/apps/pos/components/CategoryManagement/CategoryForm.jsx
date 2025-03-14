import React, { useState } from 'react';

const CategoryForm = ({ addCategory }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory(name);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" />
      <button type="submit">Add Category</button>
    </form>
  );
};

export default CategoryForm;
