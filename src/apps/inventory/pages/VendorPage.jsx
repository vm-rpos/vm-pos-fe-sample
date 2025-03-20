// VendorPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VendorForm from "../components/VendorForm";
import VendorList from "../components/VendorList";
import '../styles/VendorPage.css'

const API_BASE_URL = "http://localhost:5000/api-ivm/vendors";

const VendorPage = () => {
  const [vendors, setVendors] = useState([]);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE_URL);
      setVendors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const addVendor = async (formData) => {
    try {
      const res = await axios.post(API_BASE_URL, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setVendors([...vendors, res.data]);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to add vendor");
    }
  };

  const updateVendor = async (id, formData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      
      setVendors(vendors.map((vendor) => (vendor._id === id ? res.data : vendor)));
      
      setIsEditing(false);
      setCurrentVendor(null);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update vendor");
    }
  };

  const deleteVendor = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setVendors(vendors.filter((vendor) => vendor._id !== id));
    } catch (err) {
      console.error("Error deleting vendor:", err);
    }
  };

  const editVendor = (vendor) => {
    setCurrentVendor(vendor);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setCurrentVendor(null);
    setIsEditing(false);
  };

  return (
    <div className="vendor-page">
      <h2>Vendors</h2>
      <VendorForm 
        addVendor={addVendor} 
        updateVendor={updateVendor} 
        vendor={currentVendor} 
        isEditing={isEditing} 
        cancelEdit={cancelEdit} 
      />
      {loading ? (
        <div className="loading">Loading vendors...</div>
      ) : (
        <VendorList 
          vendors={vendors} 
          deleteVendor={deleteVendor} 
          editVendor={editVendor} 
        />
      )}
      <button className="back-button" onClick={() => navigate("/")}>Back</button>
    </div>
  );
};

export default VendorPage;
