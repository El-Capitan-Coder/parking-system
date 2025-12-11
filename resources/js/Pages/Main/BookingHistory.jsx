import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import "../../../css/Main/booking-history.css";

const BookingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time_in: "",
    time_out: "",
  });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!token) {
          alert("You must login to view your booking history.");
          setLoading(false);
          return;
        }

        const res = await axios.get("/api/booking/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedHistory = res.data.map((b) => ({
          id: b.id,
          slot_number: b.slot?.slot_number || b.slot_number || "N/A",
          vehicle: b.vehicle?.plate_number || b.vehicle || "N/A",
          date: b.date,
          time_in: b.time_in,
          time_out: b.time_out,
          status: new Date(b.date) < new Date() ? "Completed" : "Upcoming",
        }));

        setHistory(formattedHistory);
      } catch (error) {
        console.error(error);
        alert("Failed to load booking history. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setFormData({
      date: booking.date,
      time_in: booking.time_in,
      time_out: booking.time_out,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setHistory(history.filter((b) => b.id !== id));
      alert("✅ Booking deleted successfully!");
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setShowConfirm(true);
  };

  const confirmSave = () => {
    setHistory(
      history.map((b) =>
        b.id === editingBooking.id ? { ...b, ...formData } : b
      )
    );
    setShowModal(false);
    setShowConfirm(false);
    alert("✅ Booking updated successfully!");
  };

  const cancelSave = () => {
    setShowConfirm(false);
  };

  if (loading)
    return (
      <Container className="text-center mt-5 pt-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading booking history...</p>
      </Container>
    );

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className="booking-history-main"
        style={{
          marginLeft: "240px",
          marginTop: "60px",
          padding: "2rem",
          maxWidth: "1200px",
          width: "100%",
          marginRight: "auto",
          marginLeft: "auto",
          minHeight: "calc(100vh - 60px)",
          background: "#f9fafb",
        }}
      >
        <h3 className="fw-bold mb-4">Booking History</h3>

        {history.length === 0 ? (
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <p className="text-center fw-bold">No bookings yet.</p>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {history.map((b) => (
              <Col md={6} lg={4} key={b.id}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="fw-bold mb-2">Slot {b.slot_number}</h5>
                    <p className="mb-1">
                      <strong className="fw-bold">Vehicle:</strong> {b.vehicle}
                    </p>
                    <p className="mb-1">
                      <strong className="fw-bold">Date:</strong> {b.date}
                    </p>
                    <p className="mb-1">
                      <strong className="fw-bold">Time In:</strong> {b.time_in}
                    </p>
                    <p className="mb-1">
                      <strong className="fw-bold">Time Out:</strong> {b.time_out}
                    </p>
                    <Badge
                      bg={b.status === "Completed" ? "secondary" : "warning"}
                      className="mt-2 fw-bold"
                    >
                      {b.status}
                    </Badge>
                    <div className="mt-3 d-flex justify-content-between">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(b)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(b.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Time In</Form.Label>
                <Form.Control
                  type="time"
                  name="time_in"
                  value={formData.time_in}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Time Out</Form.Label>
                <Form.Control
                  type="time"
                  name="time_out"
                  value={formData.time_out}
                  onChange={handleModalChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirmation Modal */}
        <Modal show={showConfirm} onHide={cancelSave}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Update</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to update this booking?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelSave}>
              No
            </Button>
            <Button variant="success" onClick={confirmSave}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default BookingHistory;
