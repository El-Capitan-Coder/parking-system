import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import MessageModal from "../../Components/Signup/MessageModal";
import ProfileSidebar from "../../Components/Profile/ProfileSidebar";
import "../../../css/Profile/profile.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState({
    show: false,
    success: false,
    message: "",
  });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
          setOriginalProfile(data.data);
        } else {
          setError("Failed to load profile.");
        }
      } catch {
        setError("Server error retrieving profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfile({ ...profile, profile_picture_file: file });

    const reader = new FileReader();
    reader.onloadend = () =>
      setProfile((prev) => ({
        ...prev,
        profile_picture_preview: reader.result,
      }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      ["first_name", "last_name", "phone", "department", "role"].forEach((f) =>
        formData.append(f, profile[f] || "")
      );
      formData.append("_method", "POST");
      if (profile.profile_picture_file) {
        formData.append("profile_picture", profile.profile_picture_file);
      }

      const res = await fetch("http://127.0.0.1:8000/api/profile/update", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      if (data.success) {
        setProfile({
          ...data.data,
          profile_picture_preview: null,
          profile_picture: data.data.profile_picture
            ? `${data.data.profile_picture}?t=${Date.now()}`
            : null,
        });
        setOriginalProfile(data.data);
        setEditing(false);

        setModalData({
          show: true,
          success: true,
          message: "Profile updated successfully!",
        });
        setTimeout(() => setModalData({ show: false }), 2000);
      } else {
        setError(data.message || "Failed to update.");
      }
    } catch {
      setError("Server error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setEditing(false);
    setError("");
  };

  if (loading)
    return (
      <div className="loading-screen">
        <Spinner animation="border" />
      </div>
    );

  if (!profile) return <div>No profile data.</div>;

  return (
    <div className="profile-layout">
      <ProfileSidebar active="profile" />

      <div className="profile-wrapper">
        <div className="profile-card-modern">
          <div className="profile-header-modern">
            <div className="profile-avatar-modern">
              {profile.profile_picture_preview || profile.profile_picture ? (
                <img
                  src={profile.profile_picture_preview || profile.profile_picture}
                  alt="Profile"
                  className="profile-img"
                />
              ) : (
                <span>{profile.first_name?.[0] || "U"}</span>
              )}

              {editing && (
                <label className="upload-btn">
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  <i className="bi bi-camera-fill"></i>
                </label>
              )}
            </div>

            <div className="profile-header-info">
              <h3>
                {profile.first_name} {profile.last_name}
              </h3>
              <p className="profile-role-modern">
                {profile.role?.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="profile-body-modern">
            <h5 className="section-title">User Information</h5>

            {/* ✅ Layout 2 */}
            <div className="profile-grid-modern">
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                {editing ? (
                  <Form.Control name="first_name" value={profile.first_name || ""} onChange={handleChange} />
                ) : (
                  <p className="readonly-field">{profile.first_name || "N/A"}</p>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                {editing ? (
                  <Form.Control name="last_name" value={profile.last_name || ""} onChange={handleChange} />
                ) : (
                  <p className="readonly-field">{profile.last_name || "N/A"}</p>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label>Department</Form.Label>
                {editing ? (
                  <Form.Control name="department" value={profile.department || ""} onChange={handleChange} />
                ) : (
                  <p className="readonly-field">{profile.department || "N/A"}</p>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label>Role</Form.Label>
                {editing ? (
                  <Form.Select name="role" value={profile.role || ""} onChange={handleChange}>
                    <option value="professor">Professor</option>
                    <option value="staff">Staff</option>
                  </Form.Select>
                ) : (
                  <p className="readonly-field">{profile.role || "N/A"}</p>
                )}
              </Form.Group>

              <Form.Group className="full">
                <Form.Label>Phone</Form.Label>
                {editing ? (
                  <Form.Control name="phone" value={profile.phone || ""} onChange={handleChange} />
                ) : (
                  <p className="readonly-field">{profile.phone || "N/A"}</p>
                )}
              </Form.Group>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="profile-buttons-modern">
              {editing ? (
                <>
                  <Button className="btn-save-modern" disabled={saving} onClick={handleSave}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button className="btn-cancel-modern" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button className="btn-edit-modern" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {modalData.show && <MessageModal modalData={modalData} />}
      </div>
    </div>
  );
}
