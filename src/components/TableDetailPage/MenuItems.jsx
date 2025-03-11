import React from 'react';

const MenuItems = ({ activeCategory, addItemToOrder }) => {
  if (!activeCategory || !activeCategory.items?.length) {
    return <p>No items in this category.</p>;
  }

  return (
    <div className="menu-items">
      <h2>{activeCategory.name}</h2>
      <ul>
        {activeCategory.items.map((item) => (
          <li key={item._id}>
            {item.name} - ₹{item.price}
            <button onClick={() => addItemToOrder(item)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuItems;
