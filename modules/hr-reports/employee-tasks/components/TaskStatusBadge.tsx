"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const colors: Record<string, string> = {
  pending: "border-amber-200 bg-amber-100 text-amber-800",
  approved: "border-green-200 bg-green-100 text-green-800",
  completed: "border-green-200 bg-green-100 text-green-800",
  rejected: "border-red-200 bg-red-100 text-red-800",
  cancelled: "border-red-200 bg-red-100 text-red-800",
  in_progress: "border-blue-200 bg-blue-100 text-blue-800",
  paused: "border-gray-200 bg-gray-100 text-gray-700",
};

export default function TaskStatusBadge({
  status,
  label,
}: {
  status?: string | null;
  label?: string | null;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("whitespace-nowrap", colors[status ?? ""])}
    >
      {label || status || "—"}
    </Badge>
  );
}
