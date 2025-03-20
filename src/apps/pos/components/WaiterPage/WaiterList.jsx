import React from "react";
import WaiterItem from "./WaiterItem";

const WaiterList = ({ waiters, deleteWaiter, editWaiter }) => {
  return (
    <div className="waiter-list">
      <div className="waiter-list-header">
        <h3 className="mb-0">Waiter List</h3>
      </div>
      
      {waiters.length > 0 ? (
        <ul>
          {waiters.map((waiter) => (
            <WaiterItem
              key={waiter._id}
              waiter={waiter}
              deleteWaiter={deleteWaiter}
              editWaiter={editWaiter}
            />
          ))}
        </ul>
      ) : (
        <div className="waiter-list-empty">
          <p>No waiters available.</p>
          <p className="text-light">Add a new waiter using the form.</p>
        </div>
      )}
    </div>
  );
};

export default WaiterList;