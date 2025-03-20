import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/CategoryManagement.css'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [editTagId, setEditTagId] = useState(null);
  const [newTagName, setNewTagName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemTags, setNewItemTags] = useState("");

  // New state variables for editing
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editItemName, setEditItemName] = useState("");
  const [editItemPrice, setEditItemPrice] = useState("");
  const [editItemDescription, setEditItemDescription] = useState("");
  const [editItemTags, setEditItemTags] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch categories
      const categoriesResponse = await axios.get(
        "http://localhost:5000/api/categories"
      );
      setCategories(categoriesResponse.data);

      // Fetch tags
      const tagsResponse = await axios.get("http://localhost:5000/api/tags");
      setTags(tagsResponse.data);

      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
  
    try {
      const token = localStorage.getItem("token"); // Ensure user is authenticated
  
      const response = await axios.post(
        "http://localhost:5000/api/categories",
        { name: newCategoryName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        }
      );
  
      setCategories([...categories, response.data]);
      setNewCategoryName("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
      console.error("Error creating category:", err);
    }
  };
  

  const startEditingCategory = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
    setEditCategoryName("");
  };

  const updateCategory = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/categories/${id}`,
        {
          name: editCategoryName,
        }
      );

      // Update categories list
      const updatedCategories = categories.map((category) => {
        if (category._id === id) {
          return response.data;
        }
        return category;
      });

      setCategories(updatedCategories);

      // Update selected category if it was the one edited
      if (selectedCategory && selectedCategory._id === id) {
        setSelectedCategory(response.data);
      }

      // Reset editing state
      setEditingCategory(null);
      setEditCategoryName("");
    } catch (err) {
      setError("Failed to update category");
      console.error("Error updating category:", err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      if (selectedCategory && selectedCategory._id === id) {
        setSelectedCategory(null);
      }
    } catch (err) {
      setError("Failed to delete category");
      console.error("Error deleting category:", err);
    }
  };

  const addMenuItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice || !selectedCategory) return;
  
    try {
      const token = localStorage.getItem("token"); // Ensure user is authenticated
  
      const tagsArray = newItemTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
  
      const response = await axios.post(
        `http://localhost:5000/api/categories/${selectedCategory._id}/items`,
        {
          name: newItemName,
          price: parseFloat(newItemPrice),
          description: newItemDescription,
          tags: tagsArray,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        }
      );
  
      // Update the categories list with the new item
      const updatedCategories = categories.map((category) => {
        if (category._id === selectedCategory._id) {
          return response.data;
        }
        return category;
      });
  
      setCategories(updatedCategories);
      setSelectedCategory(response.data);
      setNewItemName("");
      setNewItemPrice("");
      setNewItemDescription("");
      setNewItemTags("");
  
      // Refresh tags
      const tagsResponse = await axios.get("http://localhost:5000/api/tags");
      setTags(tagsResponse.data);
    } catch (err) {
      setError("Failed to add menu item");
      console.error("Error adding menu item:", err);
    }
  };
  

  const startEditingItem = (item) => {
    setEditingItem(item);
    setEditItemName(item.name);
    setEditItemPrice(item.price.toString());
    setEditItemDescription(item.description || "");
    setEditItemTags(item.tags.map((tag) => tag.name).join(", "));
  };

  const cancelEditItem = () => {
    setEditingItem(null);
    setEditItemName("");
    setEditItemPrice("");
    setEditItemDescription("");
    setEditItemTags("");
  };

  const updateMenuItem = async (categoryId, itemId) => {
    try {
      // Parse tags string into array
      const tagsArray = editItemTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const response = await axios.put(
        `http://localhost:5000/api/categories/${categoryId}/items/${itemId}`,
        {
          name: editItemName,
          price: parseFloat(editItemPrice),
          description: editItemDescription,
          tags: tagsArray,
        }
      );

      // Update the categories list after editing the item
      const updatedCategories = categories.map((category) => {
        if (category._id === categoryId) {
          return response.data;
        }
        return category;
      });

      setCategories(updatedCategories);

      if (selectedCategory && selectedCategory._id === categoryId) {
        setSelectedCategory(response.data);
      }

      // Reset editing state
      setEditingItem(null);
      setEditItemName("");
      setEditItemPrice("");
      setEditItemDescription("");
      setEditItemTags("");

      // Refresh tags
      const tagsResponse = await axios.get("http://localhost:5000/api/tags");
      setTags(tagsResponse.data);
    } catch (err) {
      setError("Failed to update menu item");
      console.error("Error updating menu item:", err);
    }
  };

  const deleteMenuItem = async (categoryId, itemId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/categories/${categoryId}/items/${itemId}`
      );

      // Update the categories list after deleting the item
      const updatedCategories = categories.map((category) => {
        if (category._id === categoryId) {
          return {
            ...category,
            items: category.items.filter((item) => item._id !== itemId),
          };
        }
        return category;
      });

      setCategories(updatedCategories);

      if (selectedCategory && selectedCategory._id === categoryId) {
        const updatedCategory = updatedCategories.find(
          (cat) => cat._id === categoryId
        );
        setSelectedCategory(updatedCategory);
      }
    } catch (err) {
      setError("Failed to delete menu item");
      console.error("Error deleting menu item:", err);
    }
  };
  // Delete tag
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tags/${id}`, { method: "DELETE" });
      const response = await fetch("http://localhost:5000/api/tags");
      const updatedTags = await response.json();
      setTags(updatedTags);
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };
  // Edit tag
  const handleEdit = (id, name) => {
    setEditTagId(id);
    setNewTagName(name);
  };
  // Save edited tag
  const handleSave = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName }),
      });

      if (response.ok) {
        setTags(tags.map(tag => (tag._id === id ? { ...tag, name: newTagName } : tag)));
        setEditTagId(null);
        setNewTagName("");
      } else {
        console.error("Failed to update tag");
      }
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };


  if (loading) return <div>Loading data...</div>;

  return (
    <div className="category-management">
      <h1>Menu Management</h1>

      {error && <p className="error">{error}</p>}

      <div className="category-section">
        <h2>Categories</h2>
        <form onSubmit={createCategory}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
          <button type="submit">Add Category</button>
        </form>

        <div className="categories-list">
          {categories.length === 0 ? (
            <p>No categories available. Create one!</p>
          ) : (
            <ul>
              {categories.map((category) => (
                <li key={category._id}>
                  {editingCategory && editingCategory._id === category._id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                      />
                      <button onClick={() => updateCategory(category._id)}>
                        Save
                      </button>
                      <button onClick={cancelEditCategory}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`category-name ${
                          selectedCategory &&
                          selectedCategory._id === category._id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category.name} ({category.items?.length || 0} items)
                      </span>
                      <button onClick={() => startEditingCategory(category)}>
                        Edit
                      </button>
                      <button onClick={() => deleteCategory(category._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="tag-section">
      <h2>Available Tags</h2>
      <div className="tags-list">
        {tags.length === 0 ? (
          <p>No tags available. Tags will be created when you add them to menu items.</p>
        ) : (
          <ul>
            {tags.map(tag => (
              <li key={tag._id} className="tag-item">
                {editTagId === tag._id ? (
                  <>
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                    />
                    <button onClick={() => handleSave(tag._id)}>Save</button>
                    <button onClick={() => setEditTagId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span>{tag.name}</span>
                    <button onClick={() => handleEdit(tag._id, tag.name)}>Edit</button>
                    <button onClick={() => handleDelete(tag._id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

      {selectedCategory && (
        <div className="items-section">
          <h2>Items in {selectedCategory.name}</h2>
          <form onSubmit={addMenuItem}>
            <div className="form-group">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter item name"
              />
              <input
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="Enter item price"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <textarea
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Enter item description"
                rows="2"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={newItemTags}
                onChange={(e) => setNewItemTags(e.target.value)}
                placeholder="Enter tags (comma-separated)"
              />
            </div>
            <button type="submit">Add Item</button>
          </form>

          <div className="items-list">
            {!selectedCategory.items || selectedCategory.items.length === 0 ? (
              <p>No items in this category. Add some!</p>
            ) : (
              <ul>
                {selectedCategory.items.map((item) => (
                  <li key={item._id}>
                    {editingItem && editingItem._id === item._id ? (
                      <div className="edit-form">
                        <div className="form-group">
                          <input
                            type="text"
                            value={editItemName}
                            onChange={(e) => setEditItemName(e.target.value)}
                            placeholder="Item name"
                          />
                          <input
                            type="number"
                            value={editItemPrice}
                            onChange={(e) => setEditItemPrice(e.target.value)}
                            min="0"
                            step="0.01"
                            placeholder="Price"
                          />
                        </div>
                        <div className="form-group">
                          <textarea
                            value={editItemDescription}
                            onChange={(e) =>
                              setEditItemDescription(e.target.value)
                            }
                            placeholder="Description"
                            rows="2"
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="text"
                            value={editItemTags}
                            onChange={(e) => setEditItemTags(e.target.value)}
                            placeholder="Tags (comma-separated)"
                          />
                        </div>
                        <button
                          onClick={() =>
                            updateMenuItem(selectedCategory._id, item._id)
                          }
                        >
                          Save
                        </button>
                        <button onClick={cancelEditItem}>Cancel</button>
                      </div>
                    ) : (
                      <div className="item-details">
                        <div className="item-main">
                          <strong>{item.name}</strong> - ₹{item.price}
                          <div className="item-actions">
                            <button onClick={() => startEditingItem(item)}>
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                deleteMenuItem(selectedCategory._id, item._id)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        {item.description && (
                          <div className="item-description">
                            {item.description}
                          </div>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="item-tags">
                            {item.tags.map((tag) => (
                              <span key={tag._id} className="tag">
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
