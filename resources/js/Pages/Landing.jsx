import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../css/landing.css";

export default function Landing() {
  return (
    <div className="landing-container">
      {/* Left side (big text) */}
      <div className="landing-left d-flex align-items-center">
        <div className="landing-text">
          <h1 className="fw-bold display-1 mb-4">
            Smart Parking <br /> Made Easy
          </h1>
          <p className="lead fs-4">
            Manage parking efficiently with real-time monitoring, secure
            access, and detailed reports — all in one platform.
          </p>
        </div>
      </div>

      {/* Right side (box) */}
      <div className="landing-right d-flex align-items-center">
        <div className="landing-box text-center">
          <h3 className="fw-bold mb-4 text-dark-green fs-2">Get Started</h3>
          <p className="mb-4 text-secondary fs-5">
            Create your account or log in to access the system.
          </p>

          <div className="d-grid gap-3">
            <Link
              to="/signup"
              className="btn btn-orange fw-semibold shadow px-4 py-3 fs-5"
            >
              <i className="bi bi-person-plus me-2"></i> Create an Account
            </Link>
            <Link
              to="/login"
              className="btn btn-outline-green fw-semibold px-4 py-3 fs-5"
            >
              <i className="bi bi-box-arrow-in-right me-2"></i> Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
