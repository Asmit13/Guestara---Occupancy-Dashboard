/**
 * dateUtils.js
 * Pure date utility functions — no third-party libraries, just native Date.
 *
 * Key insight: NEVER use new Date("2026-01-15") directly. That parses the
 * string as UTC midnight, which shifts the local date backward by your UTC
 * offset. Always split the string and pass (year, month, day) to the
 * Date constructor, which gives you local midnight.
 */

/**
 * Parse a "YYYY-MM-DD" string into a local-midnight Date.
 */
export function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Convert a Date to a "YYYY-MM-DD" string (local time).
 */
export function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Add n days to a date, returning a new Date.
 */
export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/**
 * Number of nights between two date strings (exclusive checkout convention).
 * checkIn: "2026-02-10", checkOut: "2026-02-13" → 3 nights.
 */
export function nightsBetween(checkIn, checkOut) {
  return Math.round((parseDate(checkOut) - parseDate(checkIn)) / 86_400_000);
}

/**
 * Build the 2D grid of cells for a given month.
 * Returns an array of { dateStr, isCurrentMonth } objects.
 * Length is always a multiple of 7 (complete rows).
 *
 * Example for January 2026 (Jan 1 = Thursday, index 4):
 *   Leading: Dec 28, 29, 30, 31 (4 cells)
 *   Current: Jan 1..31 (31 cells)
 *   Trailing: none (35 is already a multiple of 7)
 */
export function getCalendarCells(year, month) {
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun … 6=Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  // Leading days from the previous month
  // new Date(year, month, 0) = last day of previous month
  // new Date(year, month, -i) = (i+1) days before that
  for (let i = firstDow - 1; i >= 0; i--) {
    cells.push({ dateStr: toDateStr(new Date(year, month, -i)), isCurrentMonth: false });
  }

  // Days of the current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ dateStr: toDateStr(new Date(year, month, d)), isCurrentMonth: true });
  }

  // Trailing days from the next month (fill the last row)
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ dateStr: toDateStr(new Date(year, month + 1, nextDay++)), isCurrentMonth: false });
  }

  return cells;
}

export const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
export const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
