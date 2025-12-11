import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle, BsPerson, BsBoxArrowRight, BsBell } from "react-icons/bs";
import "../../../resources/css/Components/navbar.css";
import logoP from "../../../Images/logo-1.png";
import axios from "axios";

const AppNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("user"));

    setIsLoggedIn(!!token);
    setUser(userData || null);

    if (token) {
      fetchNotifications(token);
    }
  }, []);

  const fetchNotifications = async (token) => {
    try {
      const res = await axios.get("http://localhost:8000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming API returns an array of notifications
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="navbar-custom shadow-sm px-3" variant="dark" fixed="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/home" className="d-flex align-items-center">
          <img src={logoP} alt="Logo" className="brand-logo-image" />
          <span className="ms-2 brand-text">PASOK</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            <Link className="nav-link" to="/home">Home</Link>

            {isLoggedIn ? (
              <>
                {/* 🔔 Notifications */}
                <NavDropdown
                  title={
                    <div className="notification-icon-wrapper">
                      <BsBell size={22} className="text-white" />
                      {notifications.length > 0 && (
                        <span className="notification-badge">{notifications.length}</span>
                      )}
                    </div>
                  }
                  id="notification-dropdown"
                  align="end"
                  className="notification-dropdown"
                >
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <NavDropdown.Item key={notif.id} className="dropdown-item-custom">
                        {notif.message}
                      </NavDropdown.Item>
                    ))
                  ) : (
                    <NavDropdown.Item className="text-muted small text-center py-2">
                      No new notifications
                    </NavDropdown.Item>
                  )}
                </NavDropdown>

                {/* 👤 Profile */}
                <NavDropdown
                  title={<BsPersonCircle size={28} className="text-white" />}
                  id="account-dropdown"
                  align="end"
                  className="account-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile" className="dropdown-item-custom">
                    <BsPerson className="me-2 dropdown-icon" /> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="dropdown-item-custom text-danger">
                    <BsBoxArrowRight className="me-2 dropdown-icon" /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">Login</Link>
                <Link className="nav-link" to="/signup">Sign Up</Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
