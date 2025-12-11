import React from "react";
import ParkingUserSidebar from "../../Components/Profile/ProfileSidebar";
import ChangePasswordForm from "../../Components/Profile/ChangePasswordForm";
import "../../../css/Profile/change-password.css";

export default function ChangePassword() {
  return (
    <div className="security-container">
      {/* Sidebar */}
      <ParkingUserSidebar active="security" />

      {/* Content Section */}
      <div className="security-content">
        <h3 className="security-heading">Change Password</h3>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
