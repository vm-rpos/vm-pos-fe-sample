import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TablesPage from "./pages/TablesPage";
import TableDetailPage from "./pages/TableDetailPage";
import CategoryManagement from "./pages/CategoryManagement";
import Dashboard from "./pages/Dashboard";
import RestaurantDetails from "./pages/RestaurantDetails";
import WaiterPage from "./pages/WaiterPage";

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
