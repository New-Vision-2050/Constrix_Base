export type WorkLogViewMode = "calendar" | "table";

export interface WorkPeriod {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  startMinutes: number;
  endMinutes: number;
  goalHours: number;
  endsNextDay?: boolean;
}

export interface CalendarCell {
  date: number | null;
  isoDate?: string;
  statusKey?: string;
  statusLabel?: string;
  hours?: string;
  dotColor?: string;
  isToday?: boolean;
  isSelected?: boolean;
}
