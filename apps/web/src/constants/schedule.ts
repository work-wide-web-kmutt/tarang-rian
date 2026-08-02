export const CELL_SIZE = 100;
export const DAY_COLUMN_WIDTH = 56;
export const SLOT_DURATION_MINUTES = 30;
export const MIN_DRAG_DURATION = 30;
export const ACTIVATION_DISTANCE = 8;
export const SCHEDULE_SIZE = {
  lg: {
    cellSize: 140,
    dayColumnWidth: 64,
    rowHeight: 100,
    subTextClass: "text-[10px]",
    textClass: "text-xs",
  },
  md: {
    cellSize: 100,
    dayColumnWidth: 56,
    rowHeight: 80,
    subTextClass: "text-[10px]",
    textClass: "text-xs",
    // Default
  },
  sm: {
    cellSize: 60,
    dayColumnWidth: 40,
    rowHeight: 60,
    subTextClass: "text-[8px]",
    textClass: "text-[10px]",
  },
} as const;
