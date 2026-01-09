export function formatDayShort(day: string | undefined | null): string {
  if (!day) {
    return "N/A";
  }
  const dayMap: Record<string, string> = {
    Monday: "MON",
    Tuesday: "TUE",
    Wednesday: "WED",
    Thursday: "THU",
    Friday: "FRI",
    Saturday: "SAT",
    Sunday: "SUN",
  };
  return dayMap[day] ?? day.slice(0, 3).toUpperCase();
}
