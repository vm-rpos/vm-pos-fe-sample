import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TablesPage from "./pos/pages/TablesPage";
import TableDetailPage from "./pos/pages/TableDetailPage";
import CategoryManagement from "./pos/pages/CategoryManagement";
import Dashboard from "./pos/pages/Dashboard";
import RestaurantDetails from "./pos/pages/RestaurantDetails";
import WaiterPage from "./pos/pages/WaiterPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TablesPage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/table/:id" element={<TableDetailPage />} />
        <Route path="/menu-management" element={<CategoryManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/restaurant" element={<RestaurantDetails />} />
        <Route path="/waiters" element={<WaiterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
