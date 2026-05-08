# NOTES — Guestara Occupancy Dashboard

## Open-scope features chosen

### 1. Filters (Status / Room Type / Source)
**Why**: The most immediately useful addition for a front-desk tool. Being able to isolate "How full are we with *confirmed* bookings only?" or "What does Airbnb occupancy look like?" changes the colour of the entire heatmap, which is far more actionable than just reading a list.  
**Integration**: Filters are applied upstream of `buildOccupancyMap`, so the heatmap itself re-renders with filtered data. The detail panel, however, searches **all** bookings in the selected range — so a cancelled booking is still visible there even when filtered out of the heatmap.  
**Persistence**: Stored in `localStorage` so the user's filter choices survive a page reload.

### 2. Month stats strip (KPI header)
**Why**: A front-desk manager looks at the calendar for two reasons: "how full are we?" and "how much are we making?". Four numbers at the top of the screen (avg occupancy %, revenue from check-ins this month, active booking count, top room type) answer both without any clicking.  
**Integration**: Stats are derived from the filtered booking set, so they update live as filters change.

### 3. CSV Export
**Why**: Any tool used for planning eventually needs to produce a report. One button that dumps the currently-selected range to a CSV file satisfies that without any backend.  
**Integration**: Sits naturally in the detail panel header. Only appears when there are bookings to export.

## Trade-offs

### Date parsing: `parseDate` vs `new Date(str)`
Native `new Date("2026-01-15")` treats the string as **UTC midnight**, which shifts the date in any timezone with a negative UTC offset. I wrote `parseDate(str)` which splits the string and calls `new Date(year, month - 1, day)` — always local midnight — throughout the codebase. This is the single most common bug in calendar code.

### No date-fns
All date math is implemented with the native `Date` object. The only tricky part is `getCalendarCells`: `new Date(year, month, 0)` gives the last day of the previous month; `new Date(year, month, -i)` walks backward from there. It is marginally less readable than `subDays(startOfMonth(date), i)` but removes a dependency.

### State management: hooks + useMemo, not Redux
The app has three distinct state slices (view, filters, selection) with one large derived value (occupancyMap). `useMemo` is ideal here — recalculates only when `filteredBookings` changes. There is no async mutation or cross-component side-effect that would justify a reducer.

### Detail panel searches unfiltered bookings
When you filter "confirmed only" and drag a range, the panel still shows cancelled bookings for that range. Reasoning: the heatmap shows *operational* load, but the detail panel is for *finding and reading* a booking. You would not want a front-desk agent to miss a cancelled booking just because the filter is on.

### Drag selection: window mouseup
`mouseleave` on the grid container would fire if the user drags too fast. Attaching `mouseup` to `window` means the drag always finalises correctly even if the pointer escapes the grid.

## What I would do with more time

1. **Gantt / timeline view** — a per-room horizontal bar showing each booking across the month; more useful for spotting gaps than the heatmap.
2. **Keyboard navigation** — arrow keys move the focused day, Shift+Arrow extends selection, Enter opens details.
3. **Hover tooltip** — a quick summary (occupancy count, top guest names) without clicking.
4. **Year-at-a-glance** — 365 tiny cells in a GitHub-style contribution graph, instantly showing seasonal patterns.
5. **Tests** — `dateUtils` and `bookingUtils` are pure functions; they are trivial to unit-test with Vitest.
