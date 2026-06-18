/** API status dot colors (hex) */
export const STATUS_HEX_COLORS = {
  present: "#4CAF50",
  absent: "#F44336",
  late: "#FF9800",
  leave: "#9C27B0",
  off: "#9E9E9E",
  required: "#2196F3",
} as const;

export interface DotColorStyles {
  color: string;
  backgroundColor: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return hex;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getDotColorStyles(dotColor: string): DotColorStyles {
  const color = dotColor.startsWith("#") ? dotColor : STATUS_HEX_COLORS.off;

  return {
    color,
    backgroundColor: hexToRgba(color, 0.15),
  };
}
