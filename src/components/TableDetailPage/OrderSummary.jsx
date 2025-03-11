import React from 'react';

const OrderSummary = ({ selectedItems, removeItemFromOrder, updateOrderInDatabase, navigate }) => {
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = async () => {
    if (selectedItems.length === 0) return;
    await updateOrderInDatabase(selectedItems);
    alert('Order placed successfully!');
    navigate('/');
  };

  const checkoutTable = async () => {
    await updateOrderInDatabase([]);
    alert('Checkout successful! Table is now available.');
    navigate('/');
  };

  return (
    <div className="order-summary">
      <h2>Selected Items</h2>
      {selectedItems.length === 0 ? (
        <p>No items selected</p>
      ) : (
        <>
          <ul>
            {selectedItems.map((item, index) => (
              <li key={index}>
                {item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                <button onClick={() => removeItemFromOrder(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <p className="total">Total: ₹{calculateTotal()}</p>
          <button className="place-order" onClick={placeOrder}>Place Order</button>
          <button className="checkout-order" onClick={checkoutTable}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default OrderSummary;
