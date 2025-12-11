import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../../css/Profile/profile-sidebar.css";

export default function ParkingUserSidebar({ active }) {
  const navigate = useNavigate();

  return (
    <aside className="profile-sidebar">
      {/* Profile Section */}
      <div className="sidebar-section">
        <h4 className="sidebar-title">Account</h4>
        <Nav className="flex-column">
          <Nav.Link
            className={`sidebar-link ${active === "profile" ? "active" : ""}`}
            onClick={() => navigate("/profile")}
          >
            <i className="bi bi-person-circle me-2"></i> Profile Info
          </Nav.Link>

          {/* ✅ Updated Security navigation */}
          <Nav.Link
            className={`sidebar-link ${active === "security" ? "active" : ""}`}
            onClick={() => navigate("/change-password")}
          >
            <i className="bi bi-shield-lock me-2"></i> Change Password
          </Nav.Link>

          <Nav.Link
            className={`sidebar-link ${active === "notifications" ? "active" : ""}`}
            onClick={() => navigate("/notifications")}
          >
            <i className="bi bi-bell me-2"></i> Notifications
          </Nav.Link>

          <Nav.Link
            className={`sidebar-link ${active === "preferences" ? "active" : ""}`}
            onClick={() => navigate("/preferences")}
          >
            <i className="bi bi-gear me-2"></i> Preferences
          </Nav.Link>
        </Nav>
      </div>

      {/* Support Section */}
      <div className="sidebar-section">
        <h4 className="sidebar-title">Support</h4>
        <Nav className="flex-column">
          <Nav.Link
            className={`sidebar-link ${active === "help" ? "active" : ""}`}
            onClick={() => navigate("/help")}
          >
            <i className="bi bi-question-circle me-2"></i> Help Center
          </Nav.Link>

          <Nav.Link
            className={`sidebar-link ${active === "feedback" ? "active" : ""}`}
            onClick={() => navigate("/feedback")}
          >
            <i className="bi bi-chat-dots me-2"></i> Send Feedback
          </Nav.Link>
        </Nav>
      </div>
    </aside>
  );
}
