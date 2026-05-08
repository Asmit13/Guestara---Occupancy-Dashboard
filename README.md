# Guestara — Hotel Occupancy Dashboard

A single-page React app that visualises hotel bookings as an interactive occupancy heatmap calendar.

## Requirements
- **Node.js ≥ 18**
- **npm ≥ 9**

## Run locally

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/
    BookingCard.jsx    – Single booking display card
    CalendarGrid.jsx   – 7-column month grid
    DayCell.jsx        – Individual day cell with heatmap colour
    DetailPanel.jsx    – Booking list for selected range (+ CSV export)
    FilterBar.jsx      – Status / room type / source filters
    HeatLegend.jsx     – Colour scale legend
    MonthNav.jsx       – Prev / Next / Today navigation
    StatsStrip.jsx     – Monthly KPI strip
  hooks/
    useBookings.js     – fetch() loader with loading/error states
    useDragSelect.js   – native mouse-event drag selection
  utils/
    bookingUtils.js    – occupancy map, heat colour, stats, filter, export
    dateUtils.js       – pure date helpers (no libraries)
  App.jsx              – Root: state, derived data, layout
  main.jsx             – ReactDOM entry point
  index.css            – All styles
public/
  bookings.json        – The 201 mock bookings (loaded via fetch)
```

## Key design decisions

See **NOTES.md** for full reasoning.
