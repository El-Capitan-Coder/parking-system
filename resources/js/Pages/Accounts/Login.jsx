import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../../css/Accounts/login.css";
import MessageModal from "../../Components/Signup/MessageModal";

export default function Login() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ Store Laravel token + user info
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setModalData({
          success: true,
          message: "Login successful! Redirecting...",
        });

        // ✅ Redirect based on user_type
        setTimeout(() => {
          const type = data.user.user_type?.toLowerCase();

          if (type === "admin") {
            window.location.href = "/admin/dashboard";
          } else if (type === "professor") {
            window.location.href = "/professor/dashboard";
          } else {
            window.location.href = "/home";
          }
        }, 1500);
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hide modal automatically after 3 seconds
  useEffect(() => {
    if (modalData) {
      const timer = setTimeout(() => setModalData(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [modalData]);

  return (
    <div className="login-container">
      <div className="login-left"></div>

      <div className="login-right d-flex flex-column justify-content-center align-items-center">
        <div className="login-box p-4">
          <h3 className="text-center mb-4">Welcome Back</h3>
          <p className="text-center text-muted mb-5">Sign in to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-start">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control form-control-lg"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4 text-start">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-wrapper position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-control form-control-lg pe-5"
                  placeholder="Enter your password"
                  required
                />
                <span
                  className={`bi ${
                    showPassword ? "bi-eye-slash" : "bi-eye"
                  } password-toggle-icon`}
                  onClick={() => setShowPassword(!showPassword)}
                ></span>
              </div>
            </div>

            <div className="text-end mb-4">
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div className="error-message mb-4 text-danger">{error}</div>
            )}

            <div className="d-grid mb-3">
              <button
                type="submit"
                className="btn btn-primary btn-lg py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>

          <div className="extra-links mt-3 text-center">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>

      {modalData && <MessageModal modalData={modalData} />}
    </div>
  );
}
