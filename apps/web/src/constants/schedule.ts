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

export const SCHEDULE_COLOR_MODES = ["course", "single"] as const;

// Full class strings so Tailwind can see them; dark text stays readable in both themes.
export const COURSE_COLORS = [
  "border-sky-400 bg-sky-300",
  "border-emerald-400 bg-emerald-300",
  "border-amber-400 bg-amber-300",
  "border-violet-400 bg-violet-300",
  "border-pink-400 bg-pink-300",
  "border-lime-400 bg-lime-300",
  "border-orange-400 bg-orange-300",
  "border-teal-400 bg-teal-300",
  "border-fuchsia-400 bg-fuchsia-300",
  "border-indigo-400 bg-indigo-300",
] as const;
