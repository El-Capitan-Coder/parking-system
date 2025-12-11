import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Button, Spinner, Modal, Form } from "react-bootstrap";
import Sidebar from "../../Components/Admin/AdminSidebar";
import axios from "axios";

const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [slotData, setSlotData] = useState({ slot_number: "", description: "" });

  // Notification Modal
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchSlots();
  }, []);

  // Fetch all slots (admin route)
  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/admin/slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load slots.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setSlotData({ slot_number: slot.slot_number, description: slot.description });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingSlot(null);
    setSlotData({ slot_number: "", description: "" });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/admin/slots/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSlots();
      setNotificationMessage("Slot deleted successfully!");
      setShowNotification(true);
    } catch (err) {
      console.error(err);
      alert("Failed to delete slot.");
    }
  };

  const handleSave = async () => {
    try {
      if (editingSlot) {
        // Update slot (admin route)
        await axios.put(`http://localhost:8000/api/admin/slots/${editingSlot.id}`, slotData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotificationMessage("Slot updated successfully!");
      } else {
        // Add new slot (admin route)
        await axios.post("http://localhost:8000/api/admin/slots", slotData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotificationMessage("Slot added successfully!");
      }
      setShowModal(false);
      setShowNotification(true);
      fetchSlots();
    } catch (err) {
      console.error(err);
      alert("Failed to save slot.");
    }
  };

  if (loading) return <Spinner animation="border" className="m-5" />;

  if (error) return <p className="text-danger m-5">{error}</p>;

  return (
    <Container fluid className="admin-dashboard-container">
      <Row>
        <Col md={3}>
          <Sidebar />
        </Col>

        <Col md={9}>
          <h1 className="mb-4">Manage Parking Slots</h1>

          <Button className="mb-3" onClick={handleAdd}>
            Add New Slot
          </Button>

          <Card className="shadow-sm">
            <ListGroup variant="flush">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <ListGroup.Item key={slot.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{slot.slot_number}</strong> — {slot.description}
                    </div>
                    <div>
                      <Button variant="outline-primary" size="sm" onClick={() => handleEdit(slot)} className="me-2">
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(slot.id)}>
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No slots available.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>

          {/* Modal for Add/Edit */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>{editingSlot ? "Edit Slot" : "Add New Slot"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Slot Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={slotData.slot_number}
                    onChange={(e) => setSlotData({ ...slotData, slot_number: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={slotData.description}
                    onChange={(e) => setSlotData({ ...slotData, description: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="success" onClick={handleSave}>Save</Button>
            </Modal.Footer>
          </Modal>

          {/* Notification Modal */}
          <Modal show={showNotification} onHide={() => setShowNotification(false)} centered backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>{notificationMessage}</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => setShowNotification(false)}>OK</Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default ManageSlots;
