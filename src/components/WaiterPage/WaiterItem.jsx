import React from "react";

const WaiterItem = ({ waiter, deleteWaiter, editWaiter }) => {
  return (
    <li>
      {waiter.name} - {waiter.age} - {waiter.phoneNumber}
      <button onClick={() => editWaiter(waiter)}>Edit</button>
      <button onClick={() => deleteWaiter(waiter._id)}>Delete</button>
    </li>
  );
};

export default WaiterItem;