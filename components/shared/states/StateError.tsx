"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface StateErrorProps {
  /** Error message to display (uses default if not provided) */
  message?: string;
  /** Callback function for retry action */
  onRetry?: () => void;
  /** Additional CSS classes for the container */
  className?: string;
  /** Minimum height for the container */
  minHeight?: string;
}

/**
 * Reusable error state component with optional retry action
 * - Supports RTL/LTR (uses flexbox which auto-adjusts)
 * - Supports light/dark mode via Tailwind classes
 * - Accessible with proper ARIA attributes
 */
export default function StateError({
  message,
  onRetry,
  className,
  minHeight = "200px",
}: StateErrorProps) {
  const t = useTranslations("common.states");

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{ minHeight }}
      className={cn(
        // Layout - centers content, works for both RTL and LTR
        "flex flex-col items-center justify-center gap-3 p-4",
        // Full width to fill parent container
        "w-full",
        className
      )}
    >
      {/* Error icon - uses destructive color for visibility */}
      <AlertCircle
        size={40}
        className="text-destructive"
        aria-hidden="true"
      />

      {/* Error message - adapts to light/dark mode */}
      <p className="text-sm text-muted-foreground text-center max-w-md">
        {message || t("error")}
      </p>

      {/* Retry button - only shown if onRetry callback is provided */}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 rtl:ml-2 ltr:mr-2" />
          {t("retry")}
        </Button>
      )}
    </div>
  );
}

