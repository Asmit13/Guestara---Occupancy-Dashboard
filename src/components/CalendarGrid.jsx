/**
 * CalendarGrid.jsx
 * The 7-column month grid. Delegates cell rendering to DayCell.
 */
import React from 'react';
import DayCell from './DayCell.jsx';
import { getCalendarCells, DAY_NAMES, toDateStr } from '../utils/dateUtils.js';

export default function CalendarGrid({
  year, month, occupancyMap,
  selection, dragState,
  onCellMouseDown, onCellMouseEnter,
}) {
  const cells   = getCalendarCells(year, month);
  const todayStr = toDateStr(new Date());
  const { start: selStart, end: selEnd } = selection;

  return (
    <div className="calendar-grid-wrapper">
      {/* Day-of-week header */}
      <div className="calendar-header-row">
        {DAY_NAMES.map(d => <div key={d} className="dow-label">{d}</div>)}
      </div>

      {/* Day cells */}
      <div className="calendar-grid">
        {cells.map(({ dateStr, isCurrentMonth }) => {
          const occupancy  = occupancyMap[dateStr] || 0;
          const isToday    = dateStr === todayStr;
          const isSelected = selStart && selEnd && dateStr >= selStart && dateStr <= selEnd;
          const isDragging = dragState.active && dragState.inRange(dateStr);
          const isRangeStart = isSelected && dateStr === selStart;
          const isRangeEnd   = isSelected && dateStr === selEnd;

          return (
            <DayCell
              key={dateStr}
              dateStr={dateStr}
              occupancy={occupancy}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              isSelected={isSelected}
              isDragging={isDragging}
              isRangeStart={isRangeStart}
              isRangeEnd={isRangeEnd}
              onMouseDown={(e) => onCellMouseDown(dateStr, e)}
              onMouseEnter={() => onCellMouseEnter(dateStr)}
            />
          );
        })}
      </div>
    </div>
  );
}
