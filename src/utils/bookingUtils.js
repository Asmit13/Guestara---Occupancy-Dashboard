/**
 * bookingUtils.js
 * Business logic for bookings: occupancy calculation, heat colors, filtering.
 */

import { parseDate, addDays, toDateStr } from './dateUtils.js';

export const TOTAL_ROOMS = 10;

/**
 * Build a map of { "YYYY-MM-DD": roomCount } for every night that is occupied.
 *
 * CRITICAL RULE: A booking with checkIn "2026-02-10" and checkOut "2026-02-13"
 * occupies the NIGHTS of Feb 10, 11, 12 — but NOT Feb 13 (that is checkout
 * day, room is free). So we iterate: cur = checkIn; while (cur < checkOut).
 *
 * Cancelled bookings are excluded.
 */
export function buildOccupancyMap(bookings) {
  const map = {};
  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    let cur = parseDate(b.checkIn);
    const end = parseDate(b.checkOut);
    while (cur < end) {
      const key = toDateStr(cur);
      map[key] = (map[key] || 0) + 1;
      cur = addDays(cur, 1);
    }
  }
  return map;
}

/**
 * Return the HSLa background color for a given occupancy count.
 * Scale: 0 → transparent; low → teal; mid → amber; full → crimson.
 */
export function heatColor(count) {
  if (!count) return null;
  const p = Math.min(count / TOTAL_ROOMS, 1);
  // Hue sweeps from 195° (teal-blue) → 35° (amber) → 0° (crimson red)
  const h = Math.round(195 - p * 195);
  const s = Math.round(58 + p * 32);   // 58% → 90%
  const l = Math.round(54 - p * 17);   // 54% → 37%
  const a = 0.18 + p * 0.72;           // subtle at low, vivid at high
  return `hsla(${h},${s}%,${l}%,${a})`;
}

/**
 * Find all bookings that overlap a given date range.
 * Overlap condition (standard interval intersection):
 *   booking.checkIn  <= rangeEnd   AND
 *   booking.checkOut >  rangeStart
 *
 * Note: checkOut is exclusive (guest checks out that morning, room is free).
 */
export function getBookingsInRange(bookings, startStr, endStr) {
  if (!startStr) return [];
  const end = endStr || startStr;
  return bookings.filter(b => b.checkIn <= end && b.checkOut > startStr);
}

/**
 * Apply user-selected filters to the booking list.
 */
export function applyFilters(bookings, { status, roomType, source }) {
  return bookings.filter(b =>
    (status   === 'all' || b.status   === status)   &&
    (roomType === 'all' || b.roomType === roomType) &&
    (source   === 'all' || b.source   === source)
  );
}

/**
 * Compute month-level stats for the StatsStrip component.
 */
export function computeMonthStats(bookings, occupancyMap, year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const mStart = `${prefix}-01`;
  const mEnd   = `${prefix}-${String(daysInMonth).padStart(2, '0')}`;

  // Sum daily occupancies for average
  let totalOcc = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${prefix}-${String(d).padStart(2, '0')}`;
    totalOcc += occupancyMap[key] || 0;
  }
  const avgOccPct = Math.round((totalOcc / (daysInMonth * TOTAL_ROOMS)) * 100);

  // Bookings whose checkIn falls in this month (for revenue)
  const monthCheckIns = bookings.filter(
    b => b.status !== 'cancelled' && b.checkIn.startsWith(prefix)
  );
  const revenue = monthCheckIns.reduce((s, b) => s + b.totalAmount, 0);

  // Active bookings that touch this month
  const active = bookings.filter(
    b => b.status !== 'cancelled' && b.checkIn <= mEnd && b.checkOut > mStart
  );

  // Most popular room type
  const typeCounts = {};
  for (const b of active) typeCounts[b.roomType] = (typeCounts[b.roomType] || 0) + 1;
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  return { avgOccPct, revenue, activeCount: active.length, topType };
}

/** Visual metadata for each booking status */
export const STATUS_META = {
  confirmed:   { label: 'Confirmed',   color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  checked_in:  { label: 'Checked In',  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  checked_out: { label: 'Checked Out', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  cancelled:   { label: 'Cancelled',   color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
};
