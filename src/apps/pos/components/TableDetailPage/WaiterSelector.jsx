import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WaiterSelector = ({ selectedWaiterId, onWaiterSelect }) => {
  const [waiters, setWaiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api/waiters";
  
  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        setLoading(true);
        const restaurantId = JSON.parse(localStorage.getItem("user"))?.restaurantId;
        
        if (!restaurantId) {
          setError("Restaurant ID not found");
          setLoading(false);
          return;
        }
        
        const res = await axios.get(`${API_BASE_URL}?restaurantId=${restaurantId}`);
        console.log("Waiters response:", res.data); // Debug log
        
        setWaiters(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching waiters:", err);
        setError("Failed to load waiters: " + (err.response?.data?.message || err.message));
        setWaiters([]);
        setLoading(false);
      }
    };
    
    fetchWaiters();
  }, []);

  if (loading) return <div>Loading waiters...</div>;
  if (error) return <div className="error">{error}</div>;
  if (waiters.length === 0) return <div>No waiters available</div>;

  return (
    <div className="waiter-selector">
      <label htmlFor="waiter-select">Assign Waiter: </label>
      <select
        id="waiter-select"
        value={selectedWaiterId || ''}
        onChange={(e) => onWaiterSelect(e.target.value)}
      >
        <option value="">Select a waiter</option>
        {waiters.map(waiter => (
          <option key={waiter._id} value={waiter._id}>
            {waiter.name} ({waiter.phoneNumber})
          </option>
        ))}
      </select>
    </div>
  );
};

export default WaiterSelector;