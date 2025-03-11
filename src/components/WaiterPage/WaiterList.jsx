import React from "react";
import WaiterItem from "./WaiterItem";

const WaiterList = ({ waiters, deleteWaiter }) => {
  return (
    <div>
      {waiters.length > 0 ? (
        <ul>
          {waiters.map((waiter) => (
            <WaiterItem key={waiter._id} waiter={waiter} deleteWaiter={deleteWaiter} />
          ))}
        </ul>
      ) : (
        <p>No waiters available.</p>
      )}
    </div>
  );
};

export default WaiterList;
