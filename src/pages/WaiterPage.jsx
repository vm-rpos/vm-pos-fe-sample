import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WaiterForm from "../components/WaiterPage/WaiterForm";
import WaiterList from "../components/WaiterPage/WaiterList";

const API_BASE_URL = "http://localhost:5000/api/waiters";

const WaiterPage = () => {
  const [waiters, setWaiters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWaiters();
  }, []);

  const fetchWaiters = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setWaiters(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching waiters:", err);
      setWaiters([]);
    }
  };

  const addWaiter = async (formData) => {
    try {
      const res = await axios.post(API_BASE_URL, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setWaiters([...waiters, res.data]);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to add waiter");
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

  return (
    <div>
      <h2>Waiters</h2>
      <WaiterForm addWaiter={addWaiter} />
      <WaiterList waiters={waiters} deleteWaiter={deleteWaiter} />
      <button onClick={() => navigate("/")}>Back</button>
    </div>
  );
};

export default WaiterPage;
