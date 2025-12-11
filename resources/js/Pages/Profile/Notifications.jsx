import React, { useEffect, useState } from "react";
import ParkingUserSidebar from "../../Components/Profile/ProfileSidebar";
import "../../../css/Profile/notifications.css";

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // ✅ Later replace this with real backend API
  const fetchNotifications = async () => {
    try {
      // Example future API:
      // const response = await fetch("/api/notifications");
      // const data = await response.json();
      // setNotifications(data);

      // Temporary sample data (Frontend only)
      const demoData = [
        {
          id: 1,
          type: "success",
          title: "Parking Slot Confirmed",
          message: "Slot P12 reserved today at 2:00 PM",
          time: "2h ago",
          read: false,
        },
        {
          id: 2,
          type: "warning",
          title: "Session Expiring Soon",
          message: "Your slot expires in 15 minutes",
          time: "5h ago",
          read: false,
        },
        {
          id: 3,
          type: "danger",
          title: "Penalty Issued",
          message: "₱50 penalty added for overstaying 25 min",
          time: "Yesterday",
          read: true,
        },
      ];

      setTimeout(() => {
        setNotifications(demoData);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Notification Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div className="d-flex">
      <ParkingUserSidebar active="notifications" />

      <div className="profile-content">
        <h2>Notifications Summary</h2>

        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          <div className="notifications-list">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-card ${notif.read ? "read" : "unread"} ${notif.type}`}
              >
                <div className="notification-text">
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  <small>{notif.time}</small>
                </div>

                {!notif.read && (
                  <button
                    className="mark-read-btn"
                    onClick={() => markAsRead(notif.id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
