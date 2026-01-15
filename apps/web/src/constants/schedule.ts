import { TIME_SLOTS } from "@/constants/times";

export const CELL_SIZE = 100;
export const DAY_COLUMN_WIDTH = 120;
export const MIN_WIDTH = DAY_COLUMN_WIDTH + TIME_SLOTS.length * CELL_SIZE + 2;
export const BASE_MINUTES = 480;
export const SLOT_DURATION_MINUTES = 30;
export const MIN_DRAG_DURATION = 30;
export const ACTIVATION_DISTANCE = 8;
