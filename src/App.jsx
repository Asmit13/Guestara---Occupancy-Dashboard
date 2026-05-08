
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useBookings }        from './hooks/useBookings.js';
import { useDragSelect }      from './hooks/useDragSelect.js';
import { buildOccupancyMap, applyFilters, computeMonthStats, getBookingsInRange } from './utils/bookingUtils.js';
import { toDateStr }          from './utils/dateUtils.js';
import MonthNav               from './components/MonthNav.jsx';
import CalendarGrid           from './components/CalendarGrid.jsx';
import DetailPanel            from './components/DetailPanel.jsx';
import StatsStrip             from './components/StatsStrip.jsx';
import FilterBar              from './components/FilterBar.jsx';
import HeatLegend             from './components/HeatLegend.jsx';

// Persistence helpers
function readLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function today() { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; }

export default function App() {
  const { bookings, loading, error } = useBookings();

  // View state (persisted)
  const [view, setView] = useState(() => readLS('guestara_view', today()));

  useEffect(() => {
    localStorage.setItem('guestara_view', JSON.stringify(view));
  }, [view]);

  // Filter state (persisted)
  const [filters, setFilters] = useState(() =>
    readLS('guestara_filters', { status: 'all', roomType: 'all', source: 'all' })
  );
  useEffect(() => {
    localStorage.setItem('guestara_filters', JSON.stringify(filters));
  }, [filters]);

  // Selection state (finalised range after mouse-up)
  const [selection, setSelection] = useState({ start: null, end: null });

  // Drag-select hook
  const { handleCellMouseDown, handleCellMouseEnter, isInDragRange, dragging } = useDragSelect(
    useCallback(range => setSelection(range), [])
  );

  // Apply filters to raw bookings list
  const filteredBookings = useMemo(() => applyFilters(bookings, filters), [bookings, filters]);

  // Occupancy map: only counts nights for non-cancelled, filtered bookings
  const occupancyMap = useMemo(() => buildOccupancyMap(filteredBookings), [filteredBookings]);

  // Month-level stats
  const monthStats = useMemo(
    () => computeMonthStats(filteredBookings, occupancyMap, view.year, view.month),
    [filteredBookings, occupancyMap, view]
  );

  // Bookings that overlap the selected range (shown in detail panel)
  // We search ALL (unfiltered) bookings for the panel, so cancelled bookings are visible too.
  const panelBookings = useMemo(
    () => getBookingsInRange(bookings, selection.start, selection.end),
    [bookings, selection]
  );

  const goPrev  = () => setView(v => v.month === 0  ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const goNext  = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0  } : { ...v, month: v.month + 1 });
  const goToday = () => setView(today());

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
      <p>Loading bookings…</p>
    </div>
  );

  if (error) return (
    <div className="error-screen">
      <p>⚠️ Failed to load bookings.json</p>
      <p className="error-detail">{error}</p>
      <p>Make sure <code>bookings.json</code> is in the <code>public/</code> folder.</p>
    </div>
  );

  return (
    <div className="app">
      {/* Top header */}
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-logo">⬡</span>
          <span className="brand-name">Guestara</span>
          <span className="brand-tagline">Occupancy Dashboard</span>
        </div>
        <div className="header-meta">
          <span className="meta-info">{bookings.length} bookings · 10 rooms</span>
        </div>
      </header>

      {/* KPI strip */}
      <StatsStrip stats={monthStats} />

      {/* Filter bar */}
      <FilterBar filters={filters} onFiltersChange={setFilters} />

      <div className="main-layout">
        {/* Left: calendar */}
        <div className="calendar-section">
          <MonthNav
            year={view.year} month={view.month}
            onPrev={goPrev} onNext={goNext} onToday={goToday}
          />
          <CalendarGrid
            year={view.year} month={view.month}
            occupancyMap={occupancyMap}
            selection={selection}
            dragState={{ active: dragging, inRange: isInDragRange }}
            onCellMouseDown={handleCellMouseDown}
            onCellMouseEnter={handleCellMouseEnter}
          />
          <HeatLegend />
        </div>

        {/* Right: detail panel */}
        <DetailPanel
          selection={selection}
          bookings={panelBookings}
          onClear={() => setSelection({ start: null, end: null })}
        />
      </div>
    </div>
  );
}
