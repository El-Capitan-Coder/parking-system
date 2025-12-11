import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../../css/Accounts/signup.css";
import SignupForm from "../../Components/Signup/SignupForm";
import StepIndicator from "../../Components/Signup/StepIndicator";
import TermsModal from "../../Components/Signup/TermsModal";
import MessageModal from "../../Components/Signup/MessageModal";

export default function Signup() {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    officialId: "",
    phone: "",
    department: "",
    role: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [error, setError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ success: false, message: "" });

  const handleNext = () => setPage((p) => p + 1);
  const handleBack = () => setPage((p) => p - 1);

  // Auto-hide modal + redirect
  useEffect(() => {
    if (showModal && modalData.success) {
      const timer = setTimeout(() => {
        setShowModal(false);

        // ✅ Just redirect — email is already in localStorage
        window.location.href = "/verify-otp";
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showModal, modalData.success]);

  return (
    <div className="signup-container">
      <div className="signup-left"></div>
      <div className="signup-right d-flex align-items-center justify-content-center">
        <div className="signup-box p-4">
          <h3 className="text-center mb-2">Sign Up</h3>
          <p className="text-center text-muted mb-3">Create your new account</p>

          {/* Step Indicator */}
          <StepIndicator page={page} />

          {/* Signup Form */}
          <SignupForm
            page={page}
            setPage={setPage}
            formData={formData}
            setFormData={setFormData}
            error={error}
            setError={setError}
            setShowTerms={setShowTerms}
            setShowModal={setShowModal}
            setModalData={setModalData}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </div>
      </div>

      {/* Modals */}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      {showModal && <MessageModal modalData={modalData} />}
    </div>
  );
}
