import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../../../css/Accounts/resetpassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password,
            password_confirmation: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(data.message || "Password reset successful!");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setError(data.message || "Unable to reset password. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      {/* Left background panel */}
      <div className="reset-left"></div>

      {/* Right panel with form */}
      <div className="reset-right d-flex justify-content-center align-items-center">
        <div className="reset-box p-4">
          <h3 className="mb-4 text-center">Reset Password</h3>
          <p className="text-muted text-center mb-4">
            Enter your new password below.
          </p>

          <Form onSubmit={handleSubmit}>
            {/* Password Field */}
            <Form.Group className="mb-3 text-start" controlId="formPassword">
              <label className="form-label">New Password</label>
              <div className="password-wrapper position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="form-control form-control-sm pe-4"
                />
                <span
                  className={`bi ${
                    showPassword ? "bi-eye-slash" : "bi-eye"
                  } password-toggle-icon`}
                  onClick={() => setShowPassword(!showPassword)}
                ></span>
              </div>
            </Form.Group>

            {/* Confirm Password Field */}
            <Form.Group
              className="mb-4 text-start"
              controlId="formConfirmPassword"
            >
              <label className="form-label">Confirm Password</label>
              <div className="password-wrapper position-relative">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="form-control form-control-sm pe-4"
                />
                <span
                  className={`bi ${
                    showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                  } password-toggle-icon`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                ></span>
              </div>
            </Form.Group>

            {/* Feedback */}
            {error && (
              <div className="text-danger text-center small mb-3">{error}</div>
            )}
            {success && (
              <div className="text-success text-center small mb-3">
                {success}
              </div>
            )}

            {/* Disabled Button (non-pressable look) */}
            <Button
              type="submit"
              className="btn btn-primary btn-lg w-100 py-3 mb-3"
              disabled={loading}
            >
              {loading ? "Processing..." : "Reset Password"}
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
    </div>
  );
};

export default ResetPassword;