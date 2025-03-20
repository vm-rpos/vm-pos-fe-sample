
// RestaurantForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const RestaurantForm = ({ selectedRestaurant, onSuccess }) => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    location: { address: "", city: "", state: "", zip: "" },
    contact: { phone: "", email: "" },
  });
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      if (selectedRestaurant) {
        await axios.put(`http://localhost:5000/api/restaurants/${selectedRestaurant._id}`, restaurant);
      } else {
        await axios.post("http://localhost:5000/api/restaurants", restaurant);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving restaurant:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="restaurant-form" onSubmit={handleSubmit}>
      <h2>{selectedRestaurant ? "Edit Restaurant" : "Add Restaurant"}</h2>
      
      <div className="form-group">
        <label htmlFor="name">Restaurant Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={restaurant.name} 
          onChange={handleChange} 
          placeholder="Restaurant Name" 
          required 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input 
          type="text" 
          id="address" 
          name="location.address" 
          value={restaurant.location.address} 
          onChange={handleChange} 
          placeholder="Street Address" 
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input 
            type="text" 
            id="city" 
            name="location.city" 
            value={restaurant.location.city} 
            onChange={handleChange} 
            placeholder="City" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input 
            type="text" 
            id="state" 
            name="location.state" 
            value={restaurant.location.state} 
            onChange={handleChange} 
            placeholder="State" 
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="zip">ZIP Code</label>
        <input 
          type="text" 
          id="zip" 
          name="location.zip" 
          value={restaurant.location.zip} 
          onChange={handleChange} 
          placeholder="ZIP Code" 
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input 
            type="text" 
            id="phone" 
            name="contact.phone" 
            value={restaurant.contact.phone} 
            onChange={handleChange} 
            placeholder="Phone Number" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="contact.email" 
            value={restaurant.contact.email} 
            onChange={handleChange} 
            placeholder="Email Address" 
          />
        </div>
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : selectedRestaurant ? "Update Restaurant" : "Add Restaurant"}
      </button>
    </form>
  );
};

export default RestaurantForm;
