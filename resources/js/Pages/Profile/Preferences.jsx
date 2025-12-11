import React, { useState } from "react";
import ParkingUserSidebar from "../../Components/Profile/ProfileSidebar";
import "../../../css/Profile/preferences.css";

export default function Preferences() {
  const [preferences, setPreferences] = useState({
    enableNotifications: true,
    emailUpdates: true,
    smsUpdates: false,
    reservationReminder: true,
    maintenanceReminder: false,
    darkMode: false,
  });

  const handleToggle = (key) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const handleSave = () => {
    alert("✅ Preferences saved successfully!");
  };

  const handleReset = () => {
    setPreferences({
      enableNotifications: true,
      emailUpdates: true,
      smsUpdates: false,
      reservationReminder: true,
      maintenanceReminder: false,
      darkMode: false,
    });
  };

  return (
    <div className="profile-wrapper">
      {/* Sidebar */}
      <div className="sidebar-section">
        <ParkingUserSidebar active="preferences" />
      </div>

      {/* Content */}
      <div className="profile-content">
        <div className="preferences-card">
          <h3 className="preferences-title">Preferences</h3>

          {/* Notifications */}
          <div className="preferences-section">
            <h5>Notifications</h5>
            <div className="switch-label">
              <span>Enable Notifications</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={preferences.enableNotifications}
                  onChange={() => handleToggle("enableNotifications")}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="switch-label">
              <span>Email Updates</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={preferences.emailUpdates}
                  onChange={() => handleToggle("emailUpdates")}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="switch-label">
              <span>SMS Updates</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={preferences.smsUpdates}
                  onChange={() => handleToggle("smsUpdates")}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {/* Reminders */}
          <div className="preferences-section">
            <h5>Parking Reminders</h5>

            <div className="switch-label">
              <span>Reservation Reminders</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={preferences.reservationReminder}
                  onChange={() => handleToggle("reservationReminder")}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="switch-label">
              <span>Vehicle Maintenance Alerts</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={preferences.maintenanceReminder}
                  onChange={() => handleToggle("maintenanceReminder")}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {/* Appearance */}
          <div className="preferences-section">
            <h5>Appearance</h5>

            <div className="switch-label">
              <span>Dark Mode</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={preferences.darkMode}
                  onChange={() => handleToggle("darkMode")}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="preferences-buttons">
            <button className="btn-save" onClick={handleSave}>
              Save Changes
            </button>
            <button className="btn-reset" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
