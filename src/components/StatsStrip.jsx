/**
 * StatsStrip.jsx
 * A horizontal bar of KPI cards shown above the calendar.
 * Props: avgOccPct, revenue, activeCount, topType
 */
import React from 'react';

function Stat({ label, value, sub }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  );
}

export default function StatsStrip({ stats }) {
  const { avgOccPct, revenue, activeCount, topType } = stats;
  const fmt = n => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="stats-strip">
      <Stat label="Avg Occupancy" value={`${avgOccPct}%`} sub="this month" />
      <Stat label="Revenue (checkIns)" value={`₹${fmt(revenue)}`} sub="active bookings" />
      <Stat label="Active Bookings" value={activeCount} sub="overlapping month" />
      <Stat label="Top Room Type" value={topType} sub="most booked" />
    </div>
  );
}
