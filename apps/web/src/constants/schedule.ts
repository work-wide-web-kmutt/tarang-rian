import { TIME_SLOTS } from "@/constants/times";

export const CELL_SIZE = 100;
export const DAY_COLUMN_WIDTH = 56;
export const MIN_WIDTH = DAY_COLUMN_WIDTH + TIME_SLOTS.length * CELL_SIZE + 2;
export const BASE_MINUTES = 480;
export const SLOT_DURATION_MINUTES = 30;
export const MIN_DRAG_DURATION = 30;
export const ACTIVATION_DISTANCE = 8;
export const SCHEDULE_SIZE = {
  sm: { cellSize: 60, dayColumnWidth: 40, rowHeight: 60 },
  md: { cellSize: 100, dayColumnWidth: 56, rowHeight: 80 }, // Default
  lg: { cellSize: 140, dayColumnWidth: 64, rowHeight: 100 },
  xl: { cellSize: 180, dayColumnWidth: 72, rowHeight: 120 },
  "2xl": { cellSize: 220, dayColumnWidth: 80, rowHeight: 140 },
  "3xl": { cellSize: 260, dayColumnWidth: 88, rowHeight: 160 },
} as const;
