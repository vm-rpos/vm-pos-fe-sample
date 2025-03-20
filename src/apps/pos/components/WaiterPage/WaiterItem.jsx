import React from "react";

const WaiterItem = ({ waiter, deleteWaiter, editWaiter }) => {
  return (
    <li className="waiter-item fade-in">
      <div className="waiter-info">
        <span className="waiter-name">{waiter.name}</span>
        <div className="waiter-details">
          <span><strong>Age:</strong> {waiter.age}</span>
          <span><strong>Phone:</strong> {waiter.phoneNumber}</span>
        </div>
      </div>
      <div className="waiter-actions">
        <button 
          className="btn btn-sm btn-outline" 
          onClick={() => editWaiter(waiter)}
        >
          Edit
        </button>
        <button 
          className="btn btn-sm btn-danger" 
          onClick={() => deleteWaiter(waiter._id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default WaiterItem;