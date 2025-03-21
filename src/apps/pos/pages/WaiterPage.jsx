import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WaiterForm from "../components/WaiterPage/WaiterForm";
import WaiterList from "../components/WaiterPage/WaiterList";
import '../styles/WaiterPage.css'

const API_BASE_URL = "http://localhost:5000/api/waiters";

const WaiterPage = () => {
  const [waiters, setWaiters] = useState([]);
  const [currentWaiter, setCurrentWaiter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWaiters();
  }, []);

  // const fetchWaiters = async () => {
  //   try {
  //     const res = await axios.get(API_BASE_URL);
  //     setWaiters(Array.isArray(res.data) ? res.data : []);
  //   } catch (err) {
  //     console.error("Error fetching waiters:", err);
  //     setWaiters([]);
  //   }
  // };

  const fetchWaiters = async () => {
    try {
      const restaurantId = JSON.parse(localStorage.getItem("user"))?.restaurantId;
      if (!restaurantId) {
        console.error("Restaurant ID not found");
        return;
      }
  
      // const res = await axios.get(`${API_BASE_URL}/waiters?restaurantId=${restaurantId}`);
      const res = await axios.get(`${API_BASE_URL}?restaurantId=${restaurantId}`);
setWaiters(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching waiters:", err);
      setWaiters([]);
    }
  };
  

  const addWaiter = async (formData) => {
    try {
      const token = localStorage.getItem("token"); // Ensure user is authenticated
      const res = await axios.post(API_BASE_URL, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
      });
      setWaiters([...waiters, res.data]);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to add waiter");
    }
  };
  

  const updateWaiter = async (id, formData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      
      setWaiters(
        waiters.map((waiter) => (waiter._id === id ? res.data : waiter))
      );
      
      setIsEditing(false);
      setCurrentWaiter(null);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update waiter");
    }
  };

  const deleteWaiter = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setWaiters(waiters.filter((waiter) => waiter._id !== id));
    } catch (err) {
      console.error("Error deleting waiter:", err);
    }
  };

  const editWaiter = (waiter) => {
    setCurrentWaiter(waiter);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setCurrentWaiter(null);
    setIsEditing(false);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Waiter Management</h2>
        <button className="btn btn-outline" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>

      <div className="waiter-page">
        <div>
          {isEditing ? (
            <WaiterForm
              addWaiter={addWaiter}
              updateWaiter={updateWaiter}
              waiter={currentWaiter}
              isEditing={isEditing}
              cancelEdit={cancelEdit}
            />
          ) : (
            <WaiterForm addWaiter={addWaiter} />
          )}
        </div>
        
        <div>
          <WaiterList
            waiters={waiters}
            deleteWaiter={deleteWaiter}
            editWaiter={editWaiter}
          />
        </div>
      </div>
    </div>
  );
};

export default WaiterPage;