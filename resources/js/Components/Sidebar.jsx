import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/Components/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: "bi-house", label: "Dashboard", path: "/dashboard" },
    { icon: "bi-car-front", label: "Book Parking", path: "/book-parking" },
    { icon: "bi-car-front-fill", label: "My Vehicles", path: "/my-vehicles" },
    { icon: "bi-clock-history", label: "My Bookings", path: "/booking-history" },
  ];

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-container">
        <div className="menu-section">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`menu-item w-100 text-start ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <i className={`${item.icon} me-2`}></i>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
