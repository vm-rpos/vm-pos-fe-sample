import React from "react";

const PrintButton = ({ selectedItems, totalAmount, isPrintOnly = true }) => {
  const handlePrint = async () => {
    if (selectedItems.length === 0) {
      alert("No items to print!");
      return;
    }

    const orderData = {
      items: selectedItems.map(item => ({
        name: item.name,
        qty: item.quantity,
        price: isPrintOnly ? item.price : null
      })),
      total: isPrintOnly ? totalAmount : null
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
      className="print-button"
      onClick={handlePrint}
    >
      Print Receipt
    </button>
  );
};

export default PrintButton;