/**
 * useDragSelect.js
 *
 * Manages drag-to-select across calendar day cells using native mouse events.
 *
 * How it works:
 *  1. onMouseDown on a cell  → record anchor (dragStart)
 *  2. onMouseEnter on cells  → record current hover cell (dragEnd) while dragging
 *  3. onMouseUp anywhere     → finalise selection; min/max so backward-drag works
 *
 * The component simply attaches { onMouseDown, onMouseEnter } to every day cell,
 * and attaches onMouseUp to the calendar container (via window to catch releases
 * outside the grid).
 *
 * Cross-month drag: adjacent month cells (dimmed) still fire these events —
 * the selection includes their dateStr values and the detail panel handles them.
 */
import { useState, useCallback, useEffect } from 'react';

export function useDragSelect(onSelectionChange) {
  const [dragging, setDragging]   = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd]     = useState(null);

  // Compute the final selection range (sorted so backward-drag = same result)
  const getRange = useCallback((a, b) => {
    if (!a) return { start: null, end: null };
    const end = b || a;
    return a <= end ? { start: a, end } : { start: end, end: a };
  }, []);

  const handleCellMouseDown = useCallback((dateStr, e) => {
    e.preventDefault(); // prevent text selection while dragging
    setDragging(true);
    setDragStart(dateStr);
    setDragEnd(dateStr);
  }, []);

  const handleCellMouseEnter = useCallback((dateStr) => {
    if (dragging) setDragEnd(dateStr);
  }, [dragging]);

  // Release on mouseup anywhere in window
  useEffect(() => {
    const up = () => {
      if (dragging) {
        setDragging(false);
        const range = getRange(dragStart, dragEnd);
        onSelectionChange(range);
      }
    };
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, [dragging, dragStart, dragEnd, getRange, onSelectionChange]);

  // Cells that are currently highlighted (during drag preview)
  const isInDragRange = useCallback((dateStr) => {
    if (!dragging || !dragStart) return false;
    const { start, end } = getRange(dragStart, dragEnd);
    return dateStr >= start && dateStr <= end;
  }, [dragging, dragStart, dragEnd, getRange]);

  return { handleCellMouseDown, handleCellMouseEnter, isInDragRange, dragging };
}
