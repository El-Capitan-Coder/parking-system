import React from "react";
import { Link } from "react-router-dom";
import "../../../css/Admin/admin-dashboard.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/manage-bookings">Manage Bookings</Link>
        <Link to="/admin/manage-slots">Manage Slots</Link>
        <Link to="/admin/manage-users">Manage Users</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
