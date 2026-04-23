import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Cars from "./pages/Cars";
import Electric from "./pages/Electric";
import CarDetails from "./pages/CarDetails";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";

import AdminRoute from "./Admin/AdminRoute";
import AdminLayout from "./Admin/AdminLayout";
import AdminDashboard from "./Admin/pages/AdminDashboard";
import AdminCars from "./Admin/pages/AdminCars";
import AdminUsers from "./Admin/pages/AdminUsers";
import AdminLogs from "./Admin/pages/AdminLogs";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/electric" element={<Electric />} />
        <Route path="/search" element={<Search />} />

        {/* Auth */}
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="cars" element={<AdminCars />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
