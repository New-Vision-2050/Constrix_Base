"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PencilLineIcon from "@/public/icons/pencil-line";

export function SectionEditPinButton({
  onClick,
  disabled,
  ariaLabel = "تعديل",
  className,
}: {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn("section-border-pin size-9 shrink-0 bg-transparent p-0 shadow-none", className)}
    >
      <PencilLineIcon additionalClass="text-pink-600 dark:text-pink-400" />
    </Button>
  );
}
