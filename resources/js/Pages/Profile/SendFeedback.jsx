import React, { useState } from "react";
import "../../../css/Profile/send-feedback.css";
import ProfileSidebar from "../../Components/Profile/ProfileSidebar";

export default function SendFeedback() {
  const [category, setCategory] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate successful send
    setTimeout(() => {
      setSuccess(true);
      setSubject("");
      setMessage("");
      setCategory("general");
    }, 500);
  };

  return (
    <div className="feedback-layout">
      {/* ✅ Sidebar */}
      <ProfileSidebar active="feedback" />

      {/* ✅ Main Content */}
      <div className="feedback-container">
        <h3 className="feedback-title">Send Feedback</h3>

        {success && (
          <div className="alert-success">
            ✅ Thank you for your feedback! We will review it shortly.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="general">General</option>
              <option value="reservation">Parking Reservation</option>
              <option value="billing">Billing & Payments</option>
              <option value="technical">Technical Issue</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              placeholder="Short summary of your feedback"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              rows="5"
              placeholder="Describe your concern or suggestion..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Attachment (Optional)</label>
            <input type="file" />
          </div>

          <button type="submit" className="btn-submit-feedback">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
