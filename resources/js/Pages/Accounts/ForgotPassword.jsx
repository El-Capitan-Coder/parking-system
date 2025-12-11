import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../../css/Accounts/forgotpassword.css";
import MessageModal from "../../Components/Signup/MessageModal";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState({
    show: false,
    success: false,
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setModalData({ show: false, success: false, message: "" });

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ✅ show success modal only
        setModalData({
          show: true,
          success: true,
          message: data.message || "Password reset link sent successfully!",
        });

        // hide modal after 2 seconds
        setTimeout(() => {
          setModalData({ show: false, success: false, message: "" });
        }, 2000);

        setEmail("");
      } else {
        // ❌ inline error only
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      {/* Left background panel */}
      <div className="forgot-left"></div>

      {/* Right panel with form */}
      <div className="forgot-right d-flex justify-content-center align-items-center">
        <div className="forgot-box p-4">
          <h3 className="mb-4 text-center">Forgot Password</h3>
          <p className="text-muted text-center mb-4">
            Enter your registered email to receive a reset link.
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4 text-start" controlId="formEmail">
              <label className="form-label">Email</label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="form-control"
              />
            </Form.Group>

            {/* ❌ Inline error only */}
            {error && (
              <div className="text-danger text-center small mb-3">{error}</div>
            )}

            <Button
              type="submit"
              className="btn btn-primary btn-lg w-100 py-3 mb-3"
              disabled={loading}
            >
              Send Reset Link
            </Button>
          </Form>

          <div className="text-center mt-3 small">
            <span className="text-muted">Back to </span>
            <Link to="/login" className="sign-in-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ Modal only on success */}
      {modalData.show && <MessageModal modalData={modalData} />}
    </div>
  );
};

export default ForgotPassword;
