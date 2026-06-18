import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";

export function useAttendanceDirection() {
  const isRtl = useIsRtl();

  return {
    isRtl,
    dir: isRtl ? ("rtl" as const) : ("ltr" as const),
    PrevIcon: (isRtl ? ChevronRight : ChevronLeft) as LucideIcon,
    NextIcon: (isRtl ? ChevronLeft : ChevronRight) as LucideIcon,
    workLogGridClass: isRtl
      ? "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4"
      : "grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4",
  };
}
