import React from 'react';
import { Badge } from 'react-bootstrap';

const BookingCard = ({ booking }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="booking-card">
      <div className="booking-info">
        <div className="booking-id">{booking.slot_number}</div>
        <div className="booking-date">{booking.booking_date}</div>
      </div>
      <Badge bg={getStatusColor(booking.status)}>
        {booking.status}
      </Badge>
    </div>
  );
};

export default BookingCard;