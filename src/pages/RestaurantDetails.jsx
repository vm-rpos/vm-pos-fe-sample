import { useState } from "react";
import RestaurantList from "../components/RestaurantDetails/RestaurantList";
import RestaurantForm from "../components/RestaurantDetails/RestaurantForm";
import { useNavigate } from "react-router-dom";

const RestaurantDetails = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const Navigate = useNavigate();

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleSuccess = () => {
    setSelectedRestaurant(null);
    setRefresh(!refresh);
  };

  return (
    <>
    <div>
      <h1>Restaurant Management</h1>
      <RestaurantForm selectedRestaurant={selectedRestaurant} onSuccess={handleSuccess} />
      <RestaurantList key={refresh} onEdit={handleEdit} />
    </div>
    <button onClick={()=>Navigate("/")}>back</button>
    </>
  );
};

export default RestaurantDetails;
