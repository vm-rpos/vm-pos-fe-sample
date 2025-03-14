import React, { useState } from 'react';

const CategoryList = ({ categories, onEdit, onDelete, onSelect }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');

  const startEditing = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
  };

  const saveEdit = () => {
    onEdit(editingCategory._id, editName);
    setEditingCategory(null);
  };

  return (
    <ul>
      {categories.map((category) => (
        <li key={category._id}>
          {editingCategory?._id === category._id ? (
            <>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingCategory(null)}>Cancel</button>
            </>
          ) : (
            <>
              <span onClick={() => onSelect(category)}>
                {category.name} ({category.items?.length || 0} items)
              </span>
              <button onClick={() => startEditing(category)}>Edit</button>
              <button onClick={() => onDelete(category._id)}>Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
