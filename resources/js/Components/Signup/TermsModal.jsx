import { useState, useEffect } from "react";

export default function TermsModal({ onClose }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 350); // match fadeOutUp duration
  };

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  return (
    <div className="terms-modal" onClick={handleClose}>
      <div
        className={`terms-content ${closing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="mb-3">Terms & Conditions</h4>
        <div className="terms-body small">
          <p>By creating an account for the UCC Parking System, you agree to:</p>
          <ul>
            <li>
              Only <strong>professors, deans, and officials</strong> can register and park.
            </li>
            <li>You must use your official UCC credentials securely.</li>
            <li>Slots must be used responsibly for school purposes only.</li>
            <li>Violations may lead to revoked parking access.</li>
          </ul>
        </div>

        {/* Gray back-style button */}
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-secondary modal-btn" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
