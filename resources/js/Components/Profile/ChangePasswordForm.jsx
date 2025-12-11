import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.new_password !== formData.confirm_password) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("Password successfully updated!");
        setFormData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="change-password-box">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            name="current_password"
            placeholder="Enter current password"
            value={formData.current_password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            name="new_password"
            placeholder="Enter new password"
            value={formData.new_password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            name="confirm_password"
            placeholder="Confirm new password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {error && <Alert className="mt-2" variant="danger">{error}</Alert>}
        {message && <Alert className="mt-2" variant="success">{message}</Alert>}

        <Button className="btn-save-modern w-100 mt-3" type="submit">
          Update Password
        </Button>
      </Form>
    </div>
  );
}
