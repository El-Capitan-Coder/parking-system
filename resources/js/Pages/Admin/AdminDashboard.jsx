import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Spinner,
  Button,
} from "react-bootstrap";
import Sidebar from "../../Components/Admin/AdminSidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../css/Admin/admin-dashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    availableSlots: 0,
    occupiedSlots: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:8000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(res.data.stats);
        setRecentBookings(res.data.recentBookings);
      } catch (err) {
        console.error("Failed to fetch admin dashboard:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard. Check console for details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading)
    return (
      <Container className="text-center mt-5 pt-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading admin dashboard...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="text-center mt-5 pt-5">
        <h3>{error}</h3>
        <Button variant="primary" href="/login" className="mt-3">
          Go to Login
        </Button>
      </Container>
    );

  return (
    <div>
      {/* 🌿 Fixed Sidebar */}
      <Sidebar />

      {/* 🌿 Main Admin Dashboard */}
      <div className="admin-dashboard-main">
        <Container fluid>
          {/* Header */}
          <div className="dashboard-header mb-4">
            <h3 className="fw-bold">Welcome, Admin!</h3>
            <p className="text-muted">
              Here’s an overview of system statistics and recent bookings.
            </p>
          </div>

          {/* Stats Overview */}
          <Row className="mb-4 g-4">
            <Col md={6} lg={3}>
              <Card className="info-card text-center shadow-sm">
                <Card.Body>
                  <h6 className="info-title">Total Users</h6>
                  <h2 className="info-value text-primary">{stats.totalUsers}</h2>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="info-card text-center shadow-sm">
                <Card.Body>
                  <h6 className="info-title">Total Bookings</h6>
                  <h2 className="info-value text-success">{stats.totalBookings}</h2>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="info-card text-center shadow-sm">
                <Card.Body>
                  <h6 className="info-title">Available Slots</h6>
                  <h2 className="info-value text-info">{stats.availableSlots}</h2>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="info-card text-center shadow-sm">
                <Card.Body>
                  <h6 className="info-title">Occupied Slots</h6>
                  <h2 className="info-value text-warning">{stats.occupiedSlots}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* 🌿 Recent Bookings */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="fw-bold bg-white border-bottom-0">
              Recent Bookings
            </Card.Header>
            <ListGroup variant="flush">
              {recentBookings.length > 0 ? (
                recentBookings.map((b, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex justify-content-between align-items-center py-3"
                  >
                    <div>
                      <strong>{b.user}</strong> — {b.plateNumber} @ {b.slot}
                    </div>
                    <Badge
                      bg={
                        b.status.toLowerCase() === "occupied"
                          ? "success"
                          : b.status.toLowerCase() === "pending"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {b.status}
                    </Badge>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No recent bookings.</ListGroup.Item>
              )}
            </ListGroup>

            <div className="text-end p-3">
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => navigate("/admin/manage-bookings")}
              >
                View All Bookings
              </Button>
            </div>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
