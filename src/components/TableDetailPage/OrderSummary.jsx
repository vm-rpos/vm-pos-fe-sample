import React from 'react';
import axios from 'axios';
import PrintButton from '../PrintButton/PrintButton';

const OrderSummary = ({ selectedItems, removeItemFromOrder, updateOrderInDatabase, navigate }) => {
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = async () => {
    if (selectedItems.length === 0) {
      alert('Please add items to place an order');
      return;
    }
    
    // First update the order in the database
    await updateOrderInDatabase(selectedItems);
    
    // Print the order (without prices - for kitchen)
    try {
      const orderData = {
        items: selectedItems.map(item => ({
          name: item.name,
          qty: item.quantity,
          price: null // No prices for kitchen order
        })),
        total: null // No total for kitchen order
      };

      const response = await fetch("http://localhost:5000/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      if (!result.success) {
        console.warn("Kitchen receipt printing failed:", result.error);
      }
    } catch (err) {
      console.error('Printing error:', err);
      // Don't block order placement if printing fails
    }
    
    alert('Order placed successfully!');
    navigate('/');
  };

  const checkoutTable = async () => {
    if (selectedItems.length === 0) {
      alert('No items to checkout');
      return;
    }
    
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

        const response = await fetch("http://localhost:5000/api/print", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        
        const result = await response.json();
        if (!result.success) {
          console.warn("Customer receipt printing failed:", result.error);
        }
      } catch (err) {
        console.error('Printing error:', err);
        // Don't block checkout if printing fails
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
          <ul className="items-list">
            {selectedItems.map((item, index) => (
              <li key={index} className="item-row">
                <span className="item-name">{item.name}</span>
                <span className="item-price">₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</span>
                <button className="remove-btn" onClick={() => removeItemFromOrder(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <p className="total">Total: ₹{calculateTotal()}</p>
          <div className="action-buttons">
            <button className="place-order" onClick={placeOrder}>Place Order</button>
            <button className="checkout-order" onClick={checkoutTable}>Checkout</button>
            <PrintButton 
              selectedItems={selectedItems.map(item => ({
                name: item.name,
                qty: item.quantity,
                price: item.price
              }))} 
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