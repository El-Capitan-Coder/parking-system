import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Button, Spinner, Modal, Form } from "react-bootstrap";
import Sidebar from "../../Components/Admin/AdminSidebar";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [userData, setUserData] = useState({ first_name: "", last_name: "", email: "" });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (user) => {
    setEditingUser(user);
    setUserData({ first_name: user.first_name, last_name: user.last_name, email: user.email });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await axios.put(
          `http://localhost:8000/api/admin/users/${editingUser.id}`,
          userData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShowEditModal(false);
        setAlertMessage("User successfully updated!");
        setShowAlertModal(true);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      setShowEditModal(false);
      setAlertMessage("Failed to update user.");
      setShowAlertModal(true);
    }
  };

  // Handle delete
  const handleDelete = (user) => {
    setEditingUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/admin/users/${editingUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowDeleteModal(false);
      setAlertMessage("User successfully deleted!");
      setShowAlertModal(true);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setShowDeleteModal(false);
      setAlertMessage("Failed to delete user.");
      setShowAlertModal(true);
    }
  };

  if (loading)
    return (
      <Container className="text-center mt-5 pt-5">
        <Spinner animation="border" />
        <p className="mt-3">Loading users...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="text-center mt-5 pt-5">
        <p className="text-danger">{error}</p>
      </Container>
    );

  return (
    <Container
      fluid
      style={{
        display: "flex",
        flexDirection: "row",
        minHeight: "calc(100vh - 60px)", // 60px for navbar
        marginTop: "60px",
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
          Manage Users
        </h2>

        <Card className="shadow-sm border-0">
          <ListGroup variant="flush">
            {users.length > 0 ? (
              users.map((user) => (
                <ListGroup.Item
                  key={user.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{user.first_name} {user.last_name}</strong> — {user.email}
                  </div>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No users found.</ListGroup.Item>
            )}
          </ListGroup>
        </Card>

        {/* ✏️ Edit Modal */}
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          centered
          backdrop="static"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1050 }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {Object.keys(userData).map((key) => (
                <Form.Group className="mb-3" controlId={key} key={key}>
                  <Form.Label style={{ textTransform: "capitalize" }}>{key.replace("_", " ")}</Form.Label>
                  <Form.Control
                    type={key === "email" ? "email" : "text"}
                    value={userData[key]}
                    onChange={(e) => setUserData({ ...userData, [key]: e.target.value })}
                  />
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 🗑 Delete Confirmation Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
          backdrop="static"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1050 }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete user:{" "}
            <strong>{editingUser?.first_name} {editingUser?.last_name}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>No</Button>
            <Button variant="danger" onClick={confirmDelete}>Yes, Delete</Button>
          </Modal.Footer>
        </Modal>

        {/* ✅ Alert Modal */}
        <Modal
          show={showAlertModal}
          onHide={() => setShowAlertModal(false)}
          centered
          backdrop="static"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1050 }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Notification</Modal.Title>
          </Modal.Header>
          <Modal.Body>{alertMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowAlertModal(false)}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default ManageUsers;
