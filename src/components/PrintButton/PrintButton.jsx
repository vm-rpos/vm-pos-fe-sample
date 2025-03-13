import React from "react";

const PrintButton = ({ selectedItems = [], totalAmount = 0, isPrintOnly = true }) => {
  const handlePrint = async () => {
    // if (!selectedItems || selectedItems.length === 0) {
    //   alert("No items to print!");
    //   return;
    // }

    // const orderData = {
    //   items: selectedItems.map(item => ({
    //     name: item.name,
    //     qty: item.qty || item.quantity,
    //     price: isPrintOnly ? (item.price || 0) : null
    //   })),
    //   total: isPrintOnly ? totalAmount : null
    // };

    try {
      const response = await fetch("http://localhost:5000/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({'aa':'bb'}),
      });

      const data = await response.json();
      if (data.success) {
        alert("Receipt sent to printer!");
      } else {
        console.warn("Print error:", data.error);
        alert("Print failed: " + (data.details || data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error: " + (error.message || "Connection failed"));
    }
  };

  const handlePrinttt = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["00002a00-0000-1000-8000-00805f9b34fb"], // Replace with your printer's service UUID
      });
  
      console.log("Connected to:", device.name);
      const server = await device.gatt.connect();
  
      const service = await server.getPrimaryService("00002a00-0000-1000-8000-00805f9b34fb"); // Use correct service UUID
      const characteristic = await service.getCharacteristic("00002a00-0000-1000-8000-00805f9b34fb"); // Use correct characteristic UUID
  
      const receiptText = `\n\nRestaurant Name\nTable: 5\nOrder: Chicken Biryani x2\nTotal: ₹500\n\n`;
      const encoder = new TextEncoder();
      const receiptData = encoder.encode(receiptText);
  
      await characteristic.writeValue(receiptData);
      alert("Receipt printed successfully!");
    } catch (error) {
      console.error("Bluetooth Print Error:", error);
      alert("Failed to print via Bluetooth: " + error.message);
    }
  };
  

  return (
    <>
      <button className="print-button" onClick={handlePrint}>
        Print Receipt (Server)
      </button>
      <button onClick={handlePrinttt}>Print via Bluetooth</button>
    </>
  );
};

export default PrintButton;
