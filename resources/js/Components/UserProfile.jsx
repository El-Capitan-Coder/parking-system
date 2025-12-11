import React from 'react';

const UserProfile = ({ user }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="user-profile">
      <div className="profile-avatar">
        {user?.avatar ? (
          <img src={user.avatar} alt="Profile" />
        ) : (
          <span className="avatar-initials">
            {getInitials(user?.name || 'User')}
          </span>
        )}
      </div>
      <h5 className="profile-name">{user?.name}</h5>
      <p className="profile-role">{user?.role}</p>
    </div>
  );
};

export default UserProfile;