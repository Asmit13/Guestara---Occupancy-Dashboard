/**
 * BookingCard.jsx
 * Displays details for a single booking in the detail panel.
 */
import React from 'react';
import { nightsBetween } from '../utils/dateUtils.js';
import { STATUS_META } from '../utils/bookingUtils.js';

function fmt(n) {
  return new Intl.NumberFormat('en-IN').format(n);
}

export default function BookingCard({ booking }) {
  const {
    id, guestName, roomNumber, roomType,
    checkIn, checkOut, guests, totalAmount, currency, status, source
  } = booking;

  const nights = nightsBetween(checkIn, checkOut);
  const meta   = STATUS_META[status] || STATUS_META.confirmed;

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <div className="booking-id-room">
          <span className="booking-id">{id}</span>
          <span className="booking-room">Room {roomNumber}</span>
          <span className="booking-room-type">{roomType}</span>
        </div>
        <span className="booking-status" style={{ color: meta.color, background: meta.bg }}>
          {meta.label}
        </span>
      </div>

      <p className="booking-guest">{guestName}</p>

      <div className="booking-details">
        <div className="booking-detail-item">
          <span className="detail-label">Check-in</span>
          <span className="detail-value">{checkIn}</span>
        </div>
        <div className="booking-detail-item">
          <span className="detail-label">Check-out</span>
          <span className="detail-value">{checkOut}</span>
        </div>
        <div className="booking-detail-item">
          <span className="detail-label">Nights</span>
          <span className="detail-value nights">{nights}</span>
        </div>
        <div className="booking-detail-item">
          <span className="detail-label">Guests</span>
          <span className="detail-value">{guests}</span>
        </div>
        <div className="booking-detail-item">
          <span className="detail-label">Amount</span>
          <span className="detail-value amount">₹{fmt(totalAmount)}</span>
        </div>
        <div className="booking-detail-item">
          <span className="detail-label">Source</span>
          <span className="detail-value">{source}</span>
        </div>
      </div>
    </div>
  );
}
