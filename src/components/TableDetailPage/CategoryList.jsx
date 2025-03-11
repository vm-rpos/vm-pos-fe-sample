import React from 'react';

const CategoryList = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="category-buttons">
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onCategoryChange(category)}
          className={activeCategory && activeCategory._id === category._id ? 'active' : ''}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryList;
