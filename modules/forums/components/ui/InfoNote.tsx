"use client";

import type { ReactNode } from "react";

/** The tinted helper bar the design places under pickers and option lists. */
export default function InfoNote({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 text-xs text-foreground/80 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-primary">
      {icon}
      <span>{children}</span>
    </div>
  );
}
