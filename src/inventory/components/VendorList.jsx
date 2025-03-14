import React from "react";
import VendorItem from "./VendorItem";

const VendorList = ({ vendors, deleteVendor, editVendor }) => {
  return (
    <div>
      {vendors.length > 0 ? (
        <ul>
          {vendors.map((vendor) => (
            <VendorItem key={vendor._id} vendor={vendor} deleteVendor={deleteVendor} editVendor={editVendor} />
          ))}
        </ul>
      ) : (
        <p>No vendors available.</p>
      )}
    </div>
  );
};

export default VendorList;
