import { useState, useEffect } from "react";
import axios from "axios";

const RestaurantForm = ({ selectedRestaurant, onSuccess }) => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    location: { address: "", city: "", state: "", zip: "" },
    contact: { phone: "", email: "" },
  });

  useEffect(() => {
    if (selectedRestaurant) {
      setRestaurant(selectedRestaurant);
    } else {
      setRestaurant({
        name: "",
        location: { address: "", city: "", state: "", zip: "" },
        contact: { phone: "", email: "" },
      });
    }
  }, [selectedRestaurant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [key, subKey] = name.split(".");
    if (subKey) {
      setRestaurant((prev) => ({
        ...prev,
        [key]: { ...prev[key], [subKey]: value },
      }));
    } else {
      setRestaurant((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRestaurant) {
        await axios.put(`http://localhost:5000/api/restaurants/${selectedRestaurant._id}`, restaurant);
      } else {
        await axios.post("http://localhost:5000/api/restaurants", restaurant);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving restaurant:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{selectedRestaurant ? "Edit Restaurant" : "Add Restaurant"}</h2>
      <input type="text" name="name" value={restaurant.name} onChange={handleChange} placeholder="Name" required />
      <input type="text" name="location.address" value={restaurant.location.address} onChange={handleChange} placeholder="Address" />
      <input type="text" name="location.city" value={restaurant.location.city} onChange={handleChange} placeholder="City" />
      <input type="text" name="location.state" value={restaurant.location.state} onChange={handleChange} placeholder="State" />
      <input type="text" name="location.zip" value={restaurant.location.zip} onChange={handleChange} placeholder="Zip Code" />
      <input type="text" name="contact.phone" value={restaurant.contact.phone} onChange={handleChange} placeholder="Phone" />
      <input type="email" name="contact.email" value={restaurant.contact.email} onChange={handleChange} placeholder="Email" />
      <button type="submit">{selectedRestaurant ? "Update" : "Add"} Restaurant</button>
    </form>
  );
};

export default RestaurantForm;
