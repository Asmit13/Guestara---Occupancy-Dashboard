/**
 * HeatLegend.jsx
 * Gradient swatch explaining the occupancy color scale.
 */
import React from 'react';
import { heatColor } from '../utils/bookingUtils.js';

export default function HeatLegend() {
  const stops = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className="heat-legend">
      <span className="legend-label">0</span>
      <div className="legend-track">
        {stops.map(n => (
          <div
            key={n}
            className="legend-stop"
            style={{ background: n === 0 ? 'var(--surface)' : heatColor(n) }}
            title={`${n}/10 rooms`}
          />
        ))}
      </div>
      <span className="legend-label">10 rooms</span>
    </div>
  );
}
