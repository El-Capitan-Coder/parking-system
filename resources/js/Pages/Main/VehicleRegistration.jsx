import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import "../../../css/Main/vehicle-registration.css";

const VehicleRegistration = () => {
  const [formData, setFormData] = useState({
    vehicle_type: "",
    plate_number: "",
    color: "",
    model: "",
  });
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [view, setView] = useState("list"); // "form" or "list"
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 5;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      if (!token) return;
      const res = await axios.get("/api/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load vehicles. Please login again.");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (!token) {
        setMessage("You must be logged in to perform this action.");
        setLoading(false);
        return;
      }

      if (editingId) {
        const res = await axios.put(`/api/vehicles/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(res.data.message || "Vehicle updated successfully!");
        setEditingId(null);
      } else {
        const res = await axios.post("/api/vehicles", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(res.data.message || "Vehicle registered successfully!");
      }

      setFormData({ vehicle_type: "", plate_number: "", color: "", model: "" });
      fetchVehicles();
      setView("list");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      vehicle_type: vehicle.vehicle_type,
      plate_number: vehicle.plate_number,
      color: vehicle.color,
      model: vehicle.model,
    });
    setEditingId(vehicle.id);
    setView("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await axios.delete(`/api/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVehicles();
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete vehicle.");
    }
  };

  // Pagination
  const indexOfLast = currentPage * vehiclesPerPage;
  const indexOfFirst = indexOfLast - vehiclesPerPage;
  const currentVehicles = vehicles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);

  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className="vehicle-main-content"
        style={{
          marginLeft: "240px",       // space for sidebar
          marginTop: "60px",         // offset for navbar
          padding: "2rem",
          maxWidth: "1200px",        // container width
          width: "100%",
          marginRight: "auto",
          marginLeft: "auto",        // center horizontally
          background: "#f9fafb",
          minHeight: "calc(100vh - 60px)",
        }}
      >
        <Container fluid className="p-0">
          <Row className="mb-4 align-items-center">
            <Col>
              <h3 className="fw-bold">{view === "form" ? (editingId ? "Edit Vehicle" : "Register Vehicle") : "My Vehicles"}</h3>
              <p className="text-muted">Manage your registered vehicles here.</p>
            </Col>
            <Col className="text-end">
              <Button
                variant={view === "form" ? "outline-primary" : "primary"}
                onClick={() => setView(view === "form" ? "list" : "form")}
              >
                {view === "form" ? "View Registered Vehicles" : "➕ Register Vehicle"}
              </Button>
            </Col>
          </Row>

          {view === "form" ? (
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Vehicle Type</Form.Label>
                    <Form.Select
                      name="vehicle_type"
                      value={formData.vehicle_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Car">Car</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Bicycle">Bicycle</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Plate Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="plate_number"
                      value={formData.plate_number}
                      onChange={handleChange}
                      placeholder="ABC-1234"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Color</Form.Label>
                    <Form.Control
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="e.g. Red"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Model</Form.Label>
                    <Form.Control
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g. Toyota Vios"
                      required
                    />
                  </Form.Group>

                  <Button type="submit" variant="success" disabled={loading}>
                    {loading ? "Saving..." : editingId ? "Update Vehicle" : "Register Vehicle"}
                  </Button>

                  {message && <p className="mt-3 text-success">{message}</p>}
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm mb-4">
              <Card.Body>
                {vehicles.length === 0 ? (
                  <p>No vehicles registered yet.</p>
                ) : (
                  <>
                    {currentVehicles.map((vehicle) => (
                      <Card key={vehicle.id} className="mb-3 shadow-sm">
                        <Card.Body>
                          <h5 className="fw-bold">{vehicle.model}</h5>
                          <p>
                            <strong>Type:</strong> {vehicle.vehicle_type} |{" "}
                            <strong>Plate:</strong> {vehicle.plate_number} |{" "}
                            <strong>Color:</strong> {vehicle.color}
                          </p>
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(vehicle)}>
                              Edit
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(vehicle.id)}>
                              Delete
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}

                    {vehicles.length > vehiclesPerPage && (
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <Button onClick={handlePrev} disabled={currentPage === 1} variant="secondary">
                          ← Prev
                        </Button>
                        <span>
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button onClick={handleNext} disabled={currentPage === totalPages} variant="secondary">
                          Next →
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>
    </div>
  );
};

export default VehicleRegistration;
