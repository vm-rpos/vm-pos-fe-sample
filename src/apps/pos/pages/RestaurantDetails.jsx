// RestaurantDetails.jsx
import { useState } from "react";
import RestaurantList from "../components/RestaurantDetails/RestaurantList";
import RestaurantForm from "../components/RestaurantDetails/RestaurantForm";
import { useNavigate } from "react-router-dom";
import '../styles/RestaurantDetails.css'

const RestaurantDetails = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleSuccess = () => {
    setSelectedRestaurant(null);
    setRefresh(!refresh);
  };

  return (
    <>
      <div className="restaurant-details">
        <h1>Restaurant Management</h1>
        <RestaurantForm selectedRestaurant={selectedRestaurant} onSuccess={handleSuccess} />
        <RestaurantList key={refresh} onEdit={handleEdit} />
      </div>
      <button className="back-button" onClick={() => navigate("/")}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>
    </>
  );
};

export default RestaurantDetails;