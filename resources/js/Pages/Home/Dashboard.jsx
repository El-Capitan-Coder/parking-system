import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Badge, Spinner, Button, ProgressBar } from "react-bootstrap";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import "../../../css/Home/dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [nextBooking, setNextBooking] = useState(null);
  const [parkingStats, setParkingStats] = useState({ total: 0, available: 0, reserved: 0, occupancyRate: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const profileRes = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileRes.data.data);

        const bookingsRes = await axios.get("/api/booking/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookingsData = bookingsRes.data;
        setTotalBookings(bookingsData.length);
        setRecentBookings(bookingsData.slice(0, 10));

        const upcoming = bookingsData.find(b => b.status === "Upcoming");
        setNextBooking(upcoming || null);

        const slotsRes = await axios.get("/api/parking/slots", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const totalSlots = slotsRes.data.length;
        const reservedSlots = slotsRes.data.filter((slot) => slot.occupied).length;
        const availableSlots = totalSlots - reservedSlots;
        const occupancyRate = totalSlots > 0 ? Math.round((reservedSlots / totalSlots) * 100) : 0;
        setParkingStats({ total: totalSlots, available: availableSlots, reserved: reservedSlots, occupancyRate });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading)
    return (
      <Container className="text-center mt-5 pt-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading your dashboard...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="text-center mt-5 pt-5">
        <h3>{error}</h3>
        <Button href="/login" className="mt-3" variant="success">
          Go to Login
        </Button>
      </Container>
    );

  return (
    <div>
      {/* Fixed Sidebar */}
      <Sidebar user={user} recentBookings={recentBookings} />

      {/* Main Dashboard Content */}
      <div className="dashboard-main">
        <Container fluid>
          {/* Header */}
          <div className="dashboard-header mb-4">
            <h3 className="fw-bold">Welcome back, {user.first_name}!</h3>
            <p className="text-muted">Here’s an overview of your parking activities.</p>
          </div>

          {/* Quick Stats */}
          <Row className="mb-4 g-4">
            <Col md={6} lg={3}>
              <Card className="info-card text-center shadow-sm">
                <Card.Body>
                  <h6 className="info-title">Total Bookings</h6>
                  <h2 className="info-value">{totalBookings}</h2>
                  <Badge bg="success">All Time</Badge>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="info-card text-center shadow-sm">
                <Card.Body>
                  <h6 className="info-title">Next Booking</h6>
                  <div className="next-booking">
                    {nextBooking ? (
                      <>
                        <p><strong>Slot {nextBooking.slot_number}</strong></p>
                        <p>{nextBooking.date} at {nextBooking.time_in}</p>
                        <Badge bg="warning">{nextBooking.status}</Badge>
                      </>
                    ) : (
                      <p>No upcoming bookings</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="info-card text-center shadow-sm">
                <Card.Body>
                  <h6 className="info-title">Available Slots</h6>
                  <h2 className="info-value">{parkingStats.available}</h2>
                  <ProgressBar now={(parkingStats.available / parkingStats.total) * 100} variant="success" />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="info-card text-center shadow-sm">
                <Card.Body>
                  <h6 className="info-title">Occupancy Rate</h6>
                  <h2 className="info-value">{parkingStats.occupancyRate}%</h2>
                  <ProgressBar now={parkingStats.occupancyRate} variant="danger" />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Bookings */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="fw-bold bg-white border-bottom-0">Recent Bookings</Card.Header>
            <ListGroup variant="flush">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <ListGroup.Item key={booking.id} className="d-flex justify-content-between align-items-center py-3">
                    <div>
                      <strong>Slot {booking.slot_number}</strong> — {booking.date} at {booking.time_in}
                    </div>
                    <Badge
                      bg={
                        booking.status === "Completed"
                          ? "secondary"
                          : booking.status === "Upcoming"
                          ? "warning"
                          : "success"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No recent bookings.</ListGroup.Item>
              )}
            </ListGroup>
            <div className="text-end p-3">
              <Button variant="outline-success" size="sm" onClick={() => (window.location.href = "/booking-history")}>
                View All Bookings
              </Button>
            </div>
          </Card>

          {/* Parking Overview */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="fw-bold bg-white border-bottom-0">Parking Overview</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p>Total Slots: <strong>{parkingStats.total}</strong></p>
                  <p>Available Slots: <strong>{parkingStats.available}</strong></p>
                  <p>Reserved Slots: <strong>{parkingStats.reserved}</strong></p>
                </Col>
                <Col md={6}>
                  <p>Occupancy Rate: <strong>{parkingStats.occupancyRate}%</strong></p>
                  <ProgressBar
                    now={parkingStats.occupancyRate}
                    label={`${parkingStats.occupancyRate}%`}
                    variant={parkingStats.occupancyRate > 75 ? "danger" : parkingStats.occupancyRate > 50 ? "warning" : "success"}
                  />
                  <div className="text-end mt-3">
                    <Button variant="success" onClick={() => (window.location.href = "/parking-map")}>
                      View Parking Map
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
