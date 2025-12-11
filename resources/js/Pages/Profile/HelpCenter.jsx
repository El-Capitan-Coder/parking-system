import React, { useState } from "react";
import "../../../css/Profile/help-center.css";
import ProfileSidebar from "../../Components/Profile/ProfileSidebar";

export default function HelpCenter() {
  const [searchText, setSearchText] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I reserve a parking slot?",
      answer:
        "Go to the Parking Reservation page, select an available slot and time, then confirm your booking.",
    },
    {
      question: "Where can I see my active reservations?",
      answer:
        "You can view them in your Dashboard or under your Reservation History section.",
    },
    {
      question: "Why was my vehicle denied access?",
      answer:
        "Check if your reservation is still active. Expired or canceled bookings may restrict entry.",
    },
    {
      question: "How do I update my vehicle information?",
      answer:
        "Go to the Profile section and select Vehicle Info to update or register your vehicle.",
    },
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="help-center-layout">
      {/* ✅ Sidebar */}
      <ProfileSidebar active="help-center" />

      {/* ✅ Main Content */}
      <div className="help-center-container">
        <h3 className="help-title">Help Center</h3>

        {/* Search Bar */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h5>Frequently Asked Questions</h5>
          {faqs
            .filter((item) =>
              item.question.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((item, index) => (
              <div key={index} className="faq-item">
                <div
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{item.question}</span>
                  <span>{expandedFAQ === index ? "−" : "+"}</span>
                </div>
                {expandedFAQ === index && (
                  <div className="faq-answer">{item.answer}</div>
                )}
              </div>
            ))}
        </div>

        {/* Support Section */}
        <div className="support-section">
          <h5>Still Need Help?</h5>
          <p>Contact our support team for further assistance.</p>
          <button className="btn-contact">Contact Support</button>
        </div>
      </div>
    </div>
  );
}
