import React from 'react';
import axios from 'axios';
import PrintButton from '../PrintButton/PrintButton';

const OrderSummary = ({ selectedItems, removeItemFromOrder, updateOrderInDatabase, navigate }) => {
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = async () => {
    if (selectedItems.length === 0) return;
    
    // First update the order in the database
    await updateOrderInDatabase(selectedItems);
    
    // Print the order (without prices - for kitchen)
    try {
      const orderData = {
        items: selectedItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          price: null
        })),
        total: null
      };

      await fetch("http://localhost:5000/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
    } catch (err) {
      console.error('Printing error:', err);
    }
    
    alert('Order placed successfully!');
    navigate('/');
  };

  const checkoutTable = async () => {
    try {
      const tableId = window.location.pathname.split('/').pop();
      
      // Print checkout receipt first (with prices - for customer)
      try {
        const orderData = {
          items: selectedItems.map(item => ({
            name: item.name,
            qty: item.quantity,
            price: item.price
          })),
          total: calculateTotal()
        };

        await fetch("http://localhost:5000/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
      } catch (err) {
        console.error('Printing error:', err);
      }
      
      // Use the correct method (DELETE) and endpoint
      await axios.delete(`http://localhost:5000/api/tables/${tableId}/orders`);
      alert('Checkout successful! Table is now available.');
      navigate('/');
    } catch (err) {
      console.error('Checkout error:', err);
      alert(`Failed to checkout table: ${err.response?.data?.message || err.message}`);
    }
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
          <div className="action-buttons">
            <button className="place-order" onClick={placeOrder}>Place Order</button>
            <button className="checkout-order" onClick={checkoutTable}>Checkout</button>
            <PrintButton 
              selectedItems={selectedItems} 
              totalAmount={calculateTotal()} 
              isPrintOnly={true} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSummary;