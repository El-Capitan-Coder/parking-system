import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../../css/Accounts/verify-otp.css";
import MessageModal from "../../Components/Signup/MessageModal"; // adjust path if needed

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // ✅ success/info inline message
  const [secondsLeft, setSecondsLeft] = useState(60); // 1 min timer
  const [resending, setResending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ success: false, message: "" });

  const navigate = useNavigate();
  const email = localStorage.getItem("verifyEmail") || "";

  useEffect(() => {
    let timer;
    if (secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const mmss = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const r = (s % 60).toString().padStart(2, "0");
    return `${m}:${r}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (data.success) {
        // ✅ show modal on success
        setModalData({ success: true, message: data.message || "Email verified successfully!" });
        setShowModal(true);

        localStorage.removeItem("verifyEmail");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        // ❌ inline error
        setError(data.message || "OTP verification failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error(err);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setSecondsLeft(data.expires_in_seconds ?? 60);
        setMessage(data.message || "A new OTP has been sent to your email."); // ✅ inline success
        if (data.dev_otp) console.log("DEV OTP:", data.dev_otp);
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error(err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-left"></div>
      <div className="verify-otp-right d-flex flex-column justify-content-center align-items-center">
        <div className="verify-otp-box p-4">
          <h3 className="text-center mb-4">Verify OTP</h3>
          <p className="text-center text-muted mb-5">
            Enter the code sent to your email
          </p>

          <form onSubmit={handleVerify}>
            <div className="mb-4 text-start">
              <label htmlFor="otp" className="form-label">
                OTP Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter 6-digit code"
                required
              />
            </div>

            <div className="text-center mb-3 timer">{mmss(secondsLeft)}</div>

            {/* ✅ Inline messages */}
            {message && <div className="text-success mb-3">{message}</div>}
            {error && <div className="text-danger mb-3">{error}</div>}

            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-primary btn-lg py-3">
                Verify
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-link resend-btn"
                onClick={handleResend}
                disabled={resending || secondsLeft > 0}
                title={secondsLeft > 0 ? `Wait ${mmss(secondsLeft)} to resend` : "Resend code"}
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </form>

          <div className="extra-links mt-4 text-center small">
            Back to <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>

      {/* ✅ Modal only on success */}
      {showModal && <MessageModal modalData={modalData} />}
    </div>
  );
}
