// VendorList.jsx
import React from "react";
import VendorItem from "./VendorItem";

const VendorList = ({ vendors, deleteVendor, editVendor }) => {
  return (
    <div className="vendor-list">
      {vendors.length > 0 ? (
        <ul>
          {vendors.map((vendor) => (
            <VendorItem 
              key={vendor._id} 
              vendor={vendor} 
              deleteVendor={deleteVendor} 
              editVendor={editVendor} 
            />
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p>No vendors available.</p>
        </div>
      )}
    </div>
  );
};

export default VendorList;