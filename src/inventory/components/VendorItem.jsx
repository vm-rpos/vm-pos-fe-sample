import React from "react";

const VendorItem = ({ vendor, deleteVendor, editVendor }) => {
  return (
    <li>
      <strong>{vendor.name}</strong> - {vendor.age} - {vendor.phoneNumber}
      <p>
        <strong>Location:</strong> {vendor.location.address}, {vendor.location.city}, {vendor.location.state} - {vendor.location.zip}
      </p>
      <button onClick={() => editVendor(vendor)}>Edit</button>
      <button onClick={() => deleteVendor(vendor._id)}>Delete</button>
    </li>
  );
};

export default VendorItem;
