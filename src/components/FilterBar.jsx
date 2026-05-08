/**
 * FilterBar.jsx
 * Lets the user filter by status, room type, and booking source.
 * Each filter is a <select>; the parent recalculates occupancyMap based on filtered bookings.
 */
import React from 'react';

const STATUSES   = ['all','confirmed','checked_in','checked_out','cancelled'];
const ROOM_TYPES = ['all','Standard','Deluxe','Suite','Penthouse'];
const SOURCES    = ['all','Direct','Airbnb','Booking.com','Expedia','Agoda','Walk-in'];

function Sel({ label, value, options, onChange }) {
  return (
    <div className="filter-group">
      <label className="filter-label">{label}</label>
      <select className="filter-select" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => (
          <option key={o} value={o}>{o === 'all' ? `All ${label}s` : o}</option>
        ))}
      </select>
    </div>
  );
}

export default function FilterBar({ filters, onFiltersChange }) {
  const set = key => val => onFiltersChange({ ...filters, [key]: val });
  return (
    <div className="filter-bar">
      <span className="filter-title">🔧 Filters</span>
      <Sel label="Status"    value={filters.status}   options={STATUSES}   onChange={set('status')} />
      <Sel label="Room Type" value={filters.roomType} options={ROOM_TYPES} onChange={set('roomType')} />
      <Sel label="Source"    value={filters.source}   options={SOURCES}    onChange={set('source')} />
      {(filters.status !== 'all' || filters.roomType !== 'all' || filters.source !== 'all') && (
        <button className="filter-clear" onClick={() => onFiltersChange({ status:'all', roomType:'all', source:'all' })}>
          ✕ Clear
        </button>
      )}
    </div>
  );
}
