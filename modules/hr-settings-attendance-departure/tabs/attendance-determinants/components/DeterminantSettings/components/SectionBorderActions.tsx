"use client";

import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export function SectionBorderActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const dirClass = isRtl ? "left-6" : "right-6";

  return (
    <div
      className={cn(
        "absolute top-3 z-10 flex -translate-y-1/2 items-center justify-center gap-1 rounded-md bg-sidebar px-2",
        "[&_.section-border-pin]:bg-transparent [&_.section-border-pin]:shadow-none",
        "[&_.section-border-pin:hover]:bg-sidebar-accent/60",
        "[&_.section-border-pin:focus-visible]:bg-sidebar-accent/60",
        dirClass,
        className,
      )}
    >
      {children}
    </div>
  );
}
