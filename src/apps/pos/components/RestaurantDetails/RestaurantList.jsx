import { useEffect, useState } from "react";
import axios from "axios";

const RestaurantList = ({ onEdit }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/restaurants");
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/restaurants/${id}`);
      fetchRestaurants();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  return (
    <div>
      <h2>Restaurant List</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant._id}>
            {restaurant.name} - {restaurant.location.city}
            <button onClick={() => onEdit(restaurant)}>Edit</button>
            <button onClick={() => handleDelete(restaurant._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantList;
