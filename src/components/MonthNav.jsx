/**
 * MonthNav.jsx
 * Navigation header: ← Month Year → with Today button.
 */
import React from 'react';
import { MONTH_NAMES } from '../utils/dateUtils.js';

export default function MonthNav({ year, month, onPrev, onNext, onToday }) {
  const today = new Date();
  const isToday = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="month-nav">
      <button className="nav-btn" onClick={onPrev} aria-label="Previous month">‹</button>
      <div className="month-title">
        <span className="month-name">{MONTH_NAMES[month]}</span>
        <span className="month-year">{year}</span>
      </div>
      <button className="nav-btn" onClick={onNext} aria-label="Next month">›</button>
      {!isToday && (
        <button className="today-btn" onClick={onToday}>Today</button>
      )}
    </div>
  );
}
