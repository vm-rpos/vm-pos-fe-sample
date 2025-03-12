import React from "react";

const PrintButton = () => {
  const handlePrint = async () => {
    const orderData = {
      items: [
        { name: "Burger", qty: 1, price: 5.0 },
        { name: "Fries", qty: 2, price: 3.0 },
      ],
      total: 11.0,
    };

    try {
      const response = await fetch("http://localhost:5000/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Printing started!");
      } else {
        alert("Print failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return (
    <button
      onClick={handlePrint}
    >
      Print Receipt
    </button>
  );
};

export default PrintButton;
