// src/Pages/Components/Home/FeaturesSection.jsx

import React from 'react';
import { 
  FaQrcode, 
  FaBell, 
  FaClipboardList, 
  FaShieldAlt, 
  FaRegCalendarCheck,
  FaChartBar
} from 'react-icons/fa';
import '../../../css/Home/home.css';

const FeaturesSection = () => {
  return (
    <div className="features-section">
      <h2 className="features-title">PASOK Features</h2>
      <div className="features-grid-3x2">
        <div className="feature-card">
          <FaRegCalendarCheck className="feature-icon" />
          <h3>Online Parking Scheduling</h3>
          <p>Reserve and assign parking slots for teachers, staff, and students ahead of time.</p>
        </div>
        <div className="feature-card">
          <FaQrcode className="feature-icon" />
          <h3>QR-Based Gate Access</h3>
          <p>Generate QR codes for quick and secure entry/exit at the school parking gates.</p>
        </div>
        <div className="feature-card">
          <FaBell className="feature-icon" />
          <h3>Smart Notifications</h3>
          <p>Get alerts for reservation reminders, unauthorized vehicle access, or schedule updates.</p>
        </div>
        <div className="feature-card">
          <FaClipboardList className="feature-icon" />
          <h3>Admin Dashboard</h3>
          <p>School admins can manage parking slots, monitor usage, and assign passes in real time.</p>
        </div>
        <div className="feature-card">
          <FaShieldAlt className="feature-icon" />
          <h3>Secure Online Kit</h3>
          <p>Provide students and staff with secure tools for managing their parking assignments.</p>
        </div>
        <div className="feature-card">
          <FaChartBar className="feature-icon" />
          <h3>Analytics & Reports</h3>
          <p>Track parking usage, slot allocation history, and generate reports for school management.</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
