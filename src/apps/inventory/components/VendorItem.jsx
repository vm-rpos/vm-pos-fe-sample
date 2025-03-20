// VendorItem.jsx
import React from "react";

const VendorItem = ({ vendor, deleteVendor, editVendor }) => {
  return (
    <li className="vendor-item">
      <div className="item-header">
        <span className="vendor-name">{vendor.name}</span>
        <div className="vendor-info">
          <span>Age: {vendor.age}</span>
          <span className="info-divider">|</span>
          <span>Phone: {vendor.phoneNumber}</span>
        </div>
      </div>
      
      <div className="location-details">
        <strong>Location:</strong> {vendor.location.address}, {vendor.location.city}, {vendor.location.state} - {vendor.location.zip}
      </div>
      
      <div className="vendor-actions">
        <button className="edit-btn" onClick={() => editVendor(vendor)}>Edit</button>
        <button className="delete-btn" onClick={() => deleteVendor(vendor._id)}>Delete</button>
      </div>
    </li>
  );
};

export default VendorItem;