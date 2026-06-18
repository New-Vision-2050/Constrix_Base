import React from "react";
import { getDotColorStyles } from "../../utils/status-colors";

export function StatusDot({
  dotColor,
  className = "w-2 h-2",
}: {
  dotColor: string;
  className?: string;
}) {
  const { color } = getDotColorStyles(dotColor);

  return (
    <span
      className={`rounded-full shrink-0 ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}

export function StatusBadge({
  label,
  dotColor,
}: {
  label: string;
  dotColor: string;
}) {
  const styles = getDotColorStyles(dotColor);

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
      style={{ color: styles.color, backgroundColor: styles.backgroundColor }}
    >
      <StatusDot dotColor={dotColor} className="w-1.5 h-1.5" />
      {label}
    </span>
  );
}
