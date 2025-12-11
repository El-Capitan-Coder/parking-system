import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button, Spinner, Modal } from "react-bootstrap";
import Sidebar from "../../Components/Sidebar";
import "../../../css/Main/book-parking.css";
import ParkingMap from "../../Components/ParkingMap";
import axios from "axios";

const BookParking = () => {
  const [vehicles, setVehicles] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    vehicle: "",
    date: "",
    timeIn: "",
    timeOut: "",
  });
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const response = await axios.get("/api/vehicles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(response.data);
      } catch (error) {
        console.error("Error loading vehicles:", error);
        showModal("Failed to load vehicles. Please login again.", false);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleSlotSelect = (slot) => setSelectedSlot(slot);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showModal = (message, success = true) => {
    setModalMessage(message);
    setModalSuccess(success);
    setModalShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicle || !selectedSlot || !formData.date || !formData.timeIn || !formData.timeOut) {
      showModal("Please complete all fields.", false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showModal("You must be logged in to book a parking slot.", false);
        return;
      }

      const payload = {
        vehicle_id: parseInt(formData.vehicle),
        slot_id: selectedSlot.id,
        date: formData.date,
        time_in: formData.timeIn,
        time_out: formData.timeOut,
      };

      // Book the slot (email will be sent automatically by backend)
      await axios.post("/api/parking/bookings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showModal("✅ Parking booked successfully! A confirmation email has been sent.", true);

      // Reset form and selection
      setStep(1);
      setSelectedSlot(null);
      setFormData({ vehicle: "", date: "", timeIn: "", timeOut: "" });
    } catch (error) {
      console.error("Error booking slot:", error.response || error);
      const msg = error.response?.data?.error || "Failed to book parking. Please try again.";
      showModal(`❌ ${msg}`, false);
    }
  };

  if (loading)
    return (
      <Container className="text-center mt-5 pt-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading your booking page...</p>
      </Container>
    );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Main Booking Content */}
      <div
        className="dashboard-main"
        style={{
          flex: 1,
          minHeight: "100vh",
          padding: "2rem",
          paddingTop: "60px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="dashboard-header mb-4">
            <h3 className="fw-bold">Book a Parking Slot</h3>
            <p className="text-muted">Select an available slot and confirm your booking.</p>
          </div>

          <Row className="g-4">
            <Col xs={12}>
              <Card className="shadow-sm p-4" style={{ minHeight: "85vh" }}>
                {step === 1 ? (
                  <div className="text-center">
                    <h5 className="fw-semibold mb-3">Select a Parking Slot</h5>
                    <ParkingMap onSlotSelect={handleSlotSelect} selectedSlot={selectedSlot} />

                    <div className="mt-4">
                      <Button
                        variant="success"
                        onClick={() => setStep(2)}
                        disabled={!selectedSlot}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <Row style={{ minHeight: "65vh" }}>
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Select Vehicle</label>
                          <select
                            name="vehicle"
                            className="form-select"
                            value={formData.vehicle}
                            onChange={handleChange}
                            required
                          >
                            <option value="">-- Select Vehicle --</option>
                            {vehicles.length > 0 ? (
                              vehicles.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.plate_number} ({v.vehicle_type})
                                </option>
                              ))
                            ) : (
                              <option disabled>No registered vehicles</option>
                            )}
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Date</label>
                          <input
                            type="date"
                            name="date"
                            className="form-control"
                            value={formData.date}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </Col>

                      <Col md={6}>
                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <label className="form-label fw-semibold">Time In</label>
                              <input
                                type="time"
                                name="timeIn"
                                className="form-control"
                                value={formData.timeIn}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <label className="form-label fw-semibold">Time Out</label>
                              <input
                                type="time"
                                name="timeOut"
                                className="form-control"
                                value={formData.timeOut}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                          <Button
                            variant="outline-secondary"
                            className="me-2"
                            onClick={() => setStep(1)}
                          >
                            ← Back
                          </Button>
                          <Button variant="success" type="submit">
                            Confirm Booking
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </form>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Notification Modal */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        centered
      >
        <Modal.Header closeButton className={modalSuccess ? "bg-success text-white" : "bg-danger text-white"}>
          <Modal.Title>{modalSuccess ? "Success" : "Error"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant={modalSuccess ? "success" : "danger"} onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookParking;
