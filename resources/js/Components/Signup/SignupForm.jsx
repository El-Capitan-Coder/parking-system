import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SignupForm({
  page,
  setPage,
  formData,
  setFormData,
  error,
  setError,
  setShowTerms,
  setShowModal,
  setModalData,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Clear error whenever page changes
  useEffect(() => {
    setError("");
  }, [page]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // --- Validators ---
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // General email format
    return emailRegex.test(email);
  };

  const validateOfficialId = (id) => {
    // Format: UCC-Position-### (e.g., UCC-Prof-001)
    const idRegex = /^UCC-[A-Za-z]+-\d{3}$/;
    return idRegex.test(id);
  };

  // --- Step-based Next Button ---
  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (page === 1) {
      if (!formData.firstName || !formData.lastName) {
        setError("First and Last Name are required.");
        return;
      }
      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    if (page === 2) {
      if (!validateOfficialId(formData.officialId)) {
        setError("ID must follow format UCC-Position-### (e.g., UCC-Prof-001).");
        return;
      }
      if (!formData.phone) {
        setError("Phone number is required.");
        return;
      }
      if (!formData.department || !formData.role) {
        setError("Department and Role are required.");
        return;
      }
    }

    setPage((p) => p + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setPage((p) => p - 1);
  };

  // --- Final Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.terms) {
      setError("You must accept the Terms & Conditions.");
      return;
    }

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      official_id: formData.officialId,
      phone: formData.phone,
      department: formData.department,
      role: formData.role,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      terms: formData.terms,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errors) {
          const messages = Object.values(data.errors).flat().join(" ");
          setError(messages);
        } else {
          setError(data.message || "Signup failed. Try again.");
        }
        return;
      }

      // Success
      localStorage.setItem("verifyEmail", formData.email);
      setModalData({
        success: true,
        message: "Signup successful! Check your email for the OTP.",
      });
      setShowModal(true);
    } catch {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <form autoComplete="off">
      {/* PAGE 1 */}
      {page === 1 && (
        <>
          <div className="row mb-3 text-start">
            <div className="col">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-control form-control-sm"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
              />
            </div>
            <div className="col">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-control form-control-sm"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
              />
            </div>
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control form-control-sm"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {error && <div className="text-danger small mb-3">{error}</div>}
          <button
            onClick={handleNext}
            className="btn btn-primary btn-lg py-3 w-100"
          >
            Next
          </button>
        </>
      )}

      {/* PAGE 2 */}
      {page === 2 && (
        <>
          <div className="row mb-3 text-start">
            <div className="col">
              <label className="form-label">ID Number</label>
              <input
                type="text"
                name="officialId"
                className="form-control form-control-sm"
                value={formData.officialId}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div className="col">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                className="form-control form-control-sm"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="row mb-3 text-start">
            <div className="col">
              <label className="form-label">Department</label>
              <input
                type="text"
                name="department"
                className="form-control form-control-sm"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <label className="form-label">Role</label>
              <select
                name="role"
                className="form-select form-select-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="professor">Professor</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>
          {error && <div className="text-danger small mb-3">{error}</div>}
          <div className="d-flex justify-content-between gap-2">
            <button
              onClick={handleBack}
              className="btn btn-secondary btn-lg py-3 w-50"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="btn btn-primary btn-lg py-3 w-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* PAGE 3 */}
      {page === 3 && (
        <>
          <div className="mb-3 text-start">
            <label className="form-label">Password</label>
            <div className="password-wrapper position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control form-control-sm pe-4"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span
                className={`bi ${
                  showPassword ? "bi-eye-slash" : "bi-eye"
                } password-toggle-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></span>
            </div>
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Confirm Password</label>
            <div className="password-wrapper position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="form-control form-control-sm pe-4"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <span
                className={`bi ${
                  showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                } password-toggle-icon`}
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              ></span>
            </div>
          </div>
          <div className="form-check mb-3 text-start">
            <input
              type="checkbox"
              name="terms"
              className="form-check-input"
              checked={formData.terms}
              onChange={handleChange}
            />
            <label className="form-check-label">
              I agree to the{" "}
              <span
                className="terms-link"
                onClick={() => setShowTerms(true)}
              >
                Terms & Conditions
              </span>
            </label>
          </div>
          {error && <div className="text-danger small mb-3">{error}</div>}
          <div className="d-flex justify-content-between gap-2">
            <button
              onClick={handleBack}
              className="btn btn-secondary btn-lg py-3 w-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary btn-lg py-3 w-50"
            >
              Sign Up
            </button>
          </div>
        </>
      )}

      <div className="extra-links mt-3 text-center small">
        Already have an account? <Link to="/login">Sign In</Link>
      </div>
    </form>
  );
}
