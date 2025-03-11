import React from "react";

const WaiterItem = ({ waiter, deleteWaiter }) => {
  return (
    <li>
      {waiter.name} - {waiter.age} - {waiter.phoneNumber}
      <button onClick={() => deleteWaiter(waiter._id)}>Delete</button>
    </li>
  );
};

export default WaiterItem;
