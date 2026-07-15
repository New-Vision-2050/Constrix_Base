/** API status dot colors (hex) */
export const STATUS_HEX_COLORS = {
  present: "#4CAF50",
  absent: "#F44336",
  late: "#FF9800",
  leave: "#9C27B0",
  off: "#9E9E9E",
  required: "#2196F3",
  on_task: "#26A69A",
} as const;

export type StatusHexColorKey = keyof typeof STATUS_HEX_COLORS;

export interface DotColorStyles {
  color: string;
  backgroundColor: string;
}

export interface CalendarDayCellStyles {
  backgroundColor: string;
  dayNumberColor: string;
  labelColor: string;
  dotColor: string;
  borderColor: string;
}

const CALENDAR_STATUS_PALETTE: Record<
  StatusHexColorKey,
  Omit<CalendarDayCellStyles, "dotColor" | "borderColor">
> = {
  off: {
    backgroundColor: "rgba(158, 158, 158, 0.14)",
    dayNumberColor: "rgba(255, 255, 255, 0.55)",
    labelColor: "#B0B0B0",
  },
  absent: {
    backgroundColor: "rgba(244, 67, 54, 0.16)",
    dayNumberColor: "rgba(255, 255, 255, 0.88)",
    labelColor: "#FF6B6B",
  },
  present: {
    backgroundColor: "rgba(76, 175, 80, 0.14)",
    dayNumberColor: "rgba(255, 255, 255, 0.88)",
    labelColor: "#66BB6A",
  },
  late: {
    backgroundColor: "rgba(255, 152, 0, 0.16)",
    dayNumberColor: "rgba(255, 255, 255, 0.88)",
    labelColor: "#FFB74D",
  },
  leave: {
    backgroundColor: "rgba(156, 39, 176, 0.14)",
    dayNumberColor: "rgba(255, 255, 255, 0.88)",
    labelColor: "#CE93D8",
  },
  required: {
    backgroundColor: "rgba(33, 150, 243, 0.14)",
    dayNumberColor: "rgba(255, 255, 255, 0.88)",
    labelColor: "#64B5F6",
  },
  on_task: {
    backgroundColor: "rgba(38, 166, 154, 0.16)",
    dayNumberColor: "rgba(255, 255, 255, 0.88)",
    labelColor: "#4DB6AC",
  },
};

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return hex;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function resolveStatusKeyFromDotColor(dotColor?: string): StatusHexColorKey | null {
  if (!dotColor?.startsWith("#")) return null;

  const normalized = dotColor.toUpperCase();
  const entry = (
    Object.entries(STATUS_HEX_COLORS) as [StatusHexColorKey, string][]
  ).find(([, hex]) => hex.toUpperCase() === normalized);

  return entry?.[0] ?? null;
}

export function getDotColorStyles(dotColor: string): DotColorStyles {
  const color = dotColor.startsWith("#") ? dotColor : STATUS_HEX_COLORS.off;

  return {
    color,
    backgroundColor: hexToRgba(color, 0.15),
  };
}

export function getCalendarDayCellStyles(
  statusKey?: string,
  dotColor?: string,
  isToday = false,
): CalendarDayCellStyles {
  const key = (
    statusKey && statusKey in CALENDAR_STATUS_PALETTE
      ? statusKey
      : resolveStatusKeyFromDotColor(dotColor) ?? "off"
  ) as StatusHexColorKey;

  const palette = CALENDAR_STATUS_PALETTE[key];
  const resolvedDot = dotColor?.startsWith("#")
    ? dotColor
    : STATUS_HEX_COLORS[key];

  // When the status is one we don't have a tuned palette for, derive the
  // colors straight from the API-provided dot color so new statuses render
  // dynamically (matching the mobile behavior) without frontend changes.
  const hasKnownPalette =
    statusKey != null && statusKey in CALENDAR_STATUS_PALETTE;
  const isDynamicHex = !hasKnownPalette && dotColor?.startsWith("#");

  const labelColor = isDynamicHex ? resolvedDot : palette.labelColor;
  const baseBackground = isDynamicHex
    ? hexToRgba(resolvedDot, 0.16)
    : palette.backgroundColor;

  return {
    ...palette,
    labelColor,
    dotColor: resolvedDot,
    borderColor: isToday ? "#2196F3" : "rgba(255, 255, 255, 0.08)",
    backgroundColor: isToday ? hexToRgba(resolvedDot, 0.22) : baseBackground,
  };
}
