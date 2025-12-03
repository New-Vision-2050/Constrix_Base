"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface StateLoadingProps {
  /** Custom loading message (optional - uses default translation if not provided) */
  message?: string;
  /** Spinner size in pixels */
  size?: number;
  /** Additional CSS classes for the container */
  className?: string;
  /** Minimum height for the container */
  minHeight?: string;
}

/**
 * Reusable loading state component
 * - Supports RTL/LTR (uses flexbox which auto-adjusts)
 * - Supports light/dark mode via Tailwind classes
 * - Accessible with proper ARIA attributes
 */
export default function StateLoading({
  message,
  size = 40,
  className,
  minHeight = "200px",
}: StateLoadingProps) {
  const t = useTranslations("common.states");

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{ minHeight }}
      className={cn(
        // Layout - centers content, works for both RTL and LTR
        "flex flex-col items-center justify-center gap-3 p-4",
        // Full width to fill parent container
        "w-full",
        className
      )}
    >
      {/* Animated spinner - color adapts to light/dark mode */}
      <Loader2
        size={size}
        className="animate-spin text-primary"
        aria-hidden="true"
      />
      
      {/* Loading message - color adapts to light/dark mode */}
      <p className="text-sm text-muted-foreground">
        {message || t("loading")}
      </p>
    </div>
  );
}

