import { TIME_SLOTS } from "@/constants/times";

export const CELL_SIZE = 100;
export const DAY_COLUMN_WIDTH = 120;
export const MIN_WIDTH = DAY_COLUMN_WIDTH + TIME_SLOTS.length * CELL_SIZE + 2;
export const BASE_MINUTES = 480;
export const SLOT_DURATION_MINUTES = 30;
export const MIN_DRAG_DURATION = 30;
export const ACTIVATION_DISTANCE = 8;
export const SCHEDULE_SIZE = {
  sm: { cellSize: 60, dayColumnWidth: 60, rowHeight: 60 },
  md: { cellSize: 100, dayColumnWidth: 120, rowHeight: 80 }, // Default
  lg: { cellSize: 140, dayColumnWidth: 160, rowHeight: 100 },
  xl: { cellSize: 180, dayColumnWidth: 200, rowHeight: 120 },
  "2xl": { cellSize: 220, dayColumnWidth: 240, rowHeight: 140 },
  "3xl": { cellSize: 260, dayColumnWidth: 280, rowHeight: 160 },
} as const;
