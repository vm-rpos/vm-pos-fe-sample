import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TablesPage from "./apps/pos/pages/TablesPage";
import TableDetailPage from "./apps/pos/pages/TableDetailPage";
import CategoryManagement from "./apps/pos/pages/CategoryManagement";
import Dashboard from "./apps/pos/pages/Dashboard";
import RestaurantDetails from "./apps/pos/pages/RestaurantDetails";
import WaiterPage from "./apps/pos/pages/WaiterPage";
import InventoryCategoryManagement from "./apps/inventory/pages/CategoryManagement";
import Home from "./apps/inventory/pages/Home";
import PurchaseOrderPage from "./apps/inventory/pages/PurchaseOrderPage";
import SaleOrderPage from "./apps/inventory/pages/SaleOrderPage";
import StockoutOrderPage from "./apps/inventory/pages/StockoutOrderPage";
import VendorPage from "./apps/inventory/pages/VendorPage";
import OrderManagementPage from "./apps/inventory/pages/OrderManagementPage";
import './App.css';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<TablesPage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/table/:id" element={<TableDetailPage />} />
        <Route path="/menu-management" element={<CategoryManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/restaurant" element={<RestaurantDetails />} />
        <Route path="/waiters" element={<WaiterPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/inventory/category" element={<InventoryCategoryManagement />} />
        <Route path="/inventory/orders/purchaseOrder" element={<PurchaseOrderPage />} />
        <Route path="/inventory/orders/saleOrder" element={<SaleOrderPage />} />
        <Route path="/inventory/orders/stockoutOrder" element={<StockoutOrderPage />} />
        <Route path="/inventory/vendors" element={<VendorPage />} />
        <Route path="/inventory/orders" element={<OrderManagementPage />} />
      </Routes>
    </Router>
    <a href="/home" className="text-red-600 hover:text-blue-800 font-semibold underline">
  Inventory-Management
</a>

    </>
  );
}

export default App;