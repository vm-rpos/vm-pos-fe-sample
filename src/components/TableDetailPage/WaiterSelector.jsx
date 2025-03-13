import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WaiterSelector = ({ selectedWaiterId, onWaiterSelect }) => {
  const [waiters, setWaiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/waiters');
        setWaiters(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load waiters');
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