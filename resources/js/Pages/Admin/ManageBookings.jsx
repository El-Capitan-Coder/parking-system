import React, { useState } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import Sidebar from "../../Components/Admin/AdminSidebar";

const ManageBookings = () => {
  // Dummy data for frontend-only simulation
  const initialBookings = [
    {
      id: 1,
      user: "John Doe",
      vehicle: "ABC123 (Sedan)",
      slot_number: "A1",
      date: "2025-11-12",
      time_in: "08:00",
      time_out: "10:00",
      status: "Pending",
    },
    {
      id: 2,
      user: "Jane Smith",
      vehicle: "XYZ789 (SUV)",
      slot_number: "B2",
      date: "2025-11-13",
      time_in: "09:00",
      time_out: "11:00",
      status: "Upcoming",
    },
  ];

  const [bookings, setBookings] = useState(initialBookings);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    user: "",
    vehicle: "",
    slot_number: "",
    date: "",
    time_in: "",
    time_out: "",
    status: "",
  });

  const [notificationMessage, setNotificationMessage] = useState("");

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setFormData({ ...booking });
    setShowEditModal(true);
  };

  const handleSave = () => {
    setBookings(
      bookings.map((b) =>
        b.id === selectedBooking.id ? { ...b, ...formData } : b
      )
    );
    setShowEditModal(false);
    setNotificationMessage("Booking edited successfully.");
    setShowNotifyModal(true);
  };

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setBookings(bookings.filter((b) => b.id !== selectedBooking.id));
    setShowDeleteModal(false);
    setNotificationMessage("Booking deleted successfully.");
    setShowNotifyModal(true);
  };

  return (
    <Container
      fluid
      style={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        background: "#f9fafb",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "230px",
          background: "#1e453e",
          color: "white",
          padding: "2rem 1rem",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem" }}>
        <h2 className="mb-4" style={{ color: "#1e453e" }}>
          Manage Bookings
        </h2>
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Vehicle</th>
                  <th>Slot</th>
                  <th>Date</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.user}</td>
                      <td>{b.vehicle}</td>
                      <td>{b.slot_number}</td>
                      <td>{b.date}</td>
                      <td>{b.time_in}</td>
                      <td>{b.time_out}</td>
                      <td>{b.status}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="info"
                          className="me-2"
                          onClick={() => handleEdit(b)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(b)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(formData).map((key) => (
              <Form.Group className="mb-3" controlId={key} key={key}>
                <Form.Label style={{ textTransform: "capitalize" }}>
                  {key.replace("_", " ")}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this booking?
          <br />
          <strong>{selectedBooking?.vehicle}</strong> —{" "}
          {selectedBooking?.slot_number}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notification Modal */}
      <Modal
        show={showNotifyModal}
        onHide={() => setShowNotifyModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{notificationMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowNotifyModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageBookings;
