/**
 * DetailPanel.jsx
 * Shown to the right of the calendar.
 * Displays all bookings that overlap the selected date range.
 * Also shows export-to-CSV button.
 */
import React, { useCallback } from 'react';
import BookingCard from './BookingCard.jsx';
import { nightsBetween } from '../utils/dateUtils.js';

function exportCSV(bookings, start, end) {
  const header = 'ID,Guest,Room,Type,CheckIn,CheckOut,Nights,Guests,Amount,Currency,Status,Source';
  const rows = bookings.map(b => {
    const nights = nightsBetween(b.checkIn, b.checkOut);
    return [
      b.id, `"${b.guestName}"`, b.roomNumber, b.roomType,
      b.checkIn, b.checkOut, nights, b.guests,
      b.totalAmount, b.currency, b.status, b.source,
    ].join(',');
  });
  const csv  = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `bookings_${start}_${end || start}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DetailPanel({ selection, bookings, onClear }) {
  const { start, end } = selection;

  if (!start) {
    return (
      <aside className="detail-panel empty-panel">
        <div className="empty-hint">
          <span className="empty-icon">📅</span>
          <p>Click a day or drag across a date range to see bookings.</p>
        </div>
      </aside>
    );
  }

  const rangeLabel = end && end !== start ? `${start} → ${end}` : start;
  const totalRevenue = bookings.reduce((s, b) => s + (b.status !== 'cancelled' ? b.totalAmount : 0), 0);
  const fmt = n => new Intl.NumberFormat('en-IN').format(n);

  return (
    <aside className="detail-panel">
      <div className="panel-header">
        <div>
          <p className="panel-range">{rangeLabel}</p>
          <p className="panel-count">
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="panel-actions">
          {bookings.length > 0 && (
            <button className="btn-export" onClick={() => exportCSV(bookings, start, end)}>
              ⬇ Export CSV
            </button>
          )}
          <button className="btn-clear" onClick={onClear}>✕</button>
        </div>
      </div>

      {bookings.length > 0 && (
        <div className="panel-revenue">
          Active revenue: <strong>₹{fmt(totalRevenue)}</strong>
        </div>
      )}

      <div className="panel-cards">
        {bookings.length === 0
          ? <p className="no-bookings">No bookings overlap this range.</p>
          : bookings.map(b => <BookingCard key={b.id} booking={b} />)
        }
      </div>
    </aside>
  );
}
