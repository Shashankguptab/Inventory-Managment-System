import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Purchase from "./pages/Purchase";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/purchases" element={<Purchase />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/sales" element={<Sales />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;