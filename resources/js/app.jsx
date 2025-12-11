import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "../../resources/css/Components/navbar.css";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Landing from "./Pages/Landing";
import Login from "./Pages/Accounts/Login";
import Signup from "./Pages/Accounts/Signup";
import VerifyOtp from "./Pages/Accounts/VerifyOtp";
import AboutUs from "./Pages/Informations/AboutUs";
import Dashboard from "./Pages/Home/Dashboard";
import ForgotPassword from "./Pages/Accounts/ForgotPassword";
import ResetPassword from "./Pages/Accounts/ResetPassword";
import Home from "./Pages/Home/Home";
import VehicleHistory from "./Pages/Home/VehicleHistory";
import ProfilePage from "./Pages/Profile/Profile";
import BookParking from "./Pages/Main/BookParking";
import ChangePassword from "./Pages/Profile/ChangePassword";
import Notifications from "./Pages/Profile/Notifications";
import Preferences from "./Pages/Profile/Preferences"; // ✅ Added
import HelpCenter from "./Pages/Profile/HelpCenter"; // ✅ Added
import SendFeedback from "./Pages/Profile/SendFeedback"; // ✅ Added
import VehicleRegistration from "./Pages/Main/VehicleRegistration"; // ✅ Import component
import BookingHistory from "./Pages/Main/BookingHistory";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ManageBookings from "./Pages/Admin/ManageBookings"; // ✅ Import ManageBookings
import ManageSlots from "./Pages/Admin/ManageSlots"; // ✅ Import ManageSlots
import ManageUsers from "./Pages/Admin/ManageUsers"; // ✅ Import ManageUsers

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Navbar always visible */}
      <Navbar />

      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public pages */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Main user features */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book-parking" element={<BookParking />} />
        <Route path="/vehicle-history" element={<VehicleHistory />} />
        <Route path="/my-vehicles" element={<VehicleRegistration />} /> {/* ✅ Added */}
        <Route path="/booking-history" element={<BookingHistory />} />

        {/* Admin pages */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* ✅ Added */}
        <Route path="/admin/manage-bookings" element={<ManageBookings />} /> {/* ✅ Added */}
        <Route path="/admin/manage-slots" element={<ManageSlots />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} /> {/* ✅ Added */}

        {/* Profile section pages */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/preferences" element={<Preferences />} /> {/* ✅ Added */}
        <Route path="/help" element={<HelpCenter />} /> {/* ✅ Added */}
        <Route path="/feedback" element={<SendFeedback />} /> {/* ✅ Added */}
      </Routes>

      {/* Footer always visible */}
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
);
