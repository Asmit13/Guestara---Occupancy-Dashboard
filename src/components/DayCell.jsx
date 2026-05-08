/**
 * DayCell.jsx
 * Renders a single day in the calendar grid.
 *
 * Props:
 *   dateStr        – "YYYY-MM-DD"
 *   occupancy      – number of rooms occupied that night (0-10)
 *   isCurrentMonth – dim the cell if outside the current month
 *   isToday        – ring around today
 *   isSelected     – in the finalised selection range
 *   isDragging     – in the live drag preview
 *   isRangeStart   – left edge of selection
 *   isRangeEnd     – right edge of selection
 *   onMouseDown    – drag start
 *   onMouseEnter   – drag move
 *   tooltip        – hover string
 */
import React from 'react';
import { heatColor, TOTAL_ROOMS } from '../utils/bookingUtils.js';

export default function DayCell({
  dateStr, occupancy, isCurrentMonth, isToday,
  isSelected, isDragging,
  isRangeStart, isRangeEnd,
  onMouseDown, onMouseEnter,
}) {
  const day = Number(dateStr.slice(8));
  const bg  = heatColor(occupancy);

  let cellClass = 'day-cell';
  if (!isCurrentMonth) cellClass += ' dim';
  if (isToday)         cellClass += ' today';
  if (isSelected)      cellClass += ' selected';
  if (isDragging)      cellClass += ' dragging';
  if (isRangeStart)    cellClass += ' range-start';
  if (isRangeEnd)      cellClass += ' range-end';

  return (
    <div
      className={cellClass}
      style={bg ? { '--heat-color': bg } : {}}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      title={occupancy ? `${occupancy}/${TOTAL_ROOMS} rooms occupied` : 'No bookings'}
    >
      <span className="day-num">{day}</span>
      {occupancy > 0 && (
        <span className="day-occ">{occupancy}/{TOTAL_ROOMS}</span>
      )}
      {occupancy > 0 && (
        <div className="heat-bar" style={{ width: `${(occupancy / TOTAL_ROOMS) * 100}%` }} />
      )}
    </div>
  );
}
