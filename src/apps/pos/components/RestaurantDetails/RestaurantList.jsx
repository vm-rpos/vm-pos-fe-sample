// RestaurantList.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const RestaurantList = ({ onEdit }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/restaurants");
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axios.delete(`http://localhost:5000/api/restaurants/${id}`);
        fetchRestaurants();
      } catch (error) {
        console.error("Error deleting restaurant:", error);
      }
    }
  };

  return (
    <div className="restaurant-list">
      <h2>Restaurant List</h2>
      
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <p>No restaurants found. Add your first restaurant!</p>
        </div>
      ) : (
        <div className="restaurants-container">
          <ul>
            {restaurants.map((restaurant) => (
              <li key={restaurant._id}>
                <div className="restaurant-info">
                  <div className="restaurant-name">{restaurant.name}</div>
                  <div className="restaurant-location">
                    {restaurant.location.city}{restaurant.location.state ? `, ${restaurant.location.state}` : ''}
                  </div>
                </div>
                <div className="restaurant-actions">
                  <button className="edit-btn" onClick={() => onEdit(restaurant)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(restaurant._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;