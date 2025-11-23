import { cn } from "@/lib/utils";
import { forwardRef } from "react";

/**
 * ColorDisplay component
 * Shows color preview circle and hex value
 * 
 * @param color - Hex color value to display
 */
interface ColorDisplayProps {
  color: string;
}

const ColorDisplay = forwardRef<HTMLButtonElement, ColorDisplayProps>(
  ({ color, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex items-center gap-3 px-2 py-1 rounded-lg",
          "bg-sidebar border border-border",
          "hover:border-primary transition-colors",
          "cursor-pointer w-full text-left"
        )}
        {...props}
      >
        {/* Color circle preview */}
        <div
          className="w-6 h-6 rounded-full border-2 border-white/20"
          style={{ backgroundColor: color }}
          aria-label="Color preview"
        />

        {/* Color hex value */}
        <span className="font-mono text-sm">
          {color}
        </span>
      </button>
    );
  }
);

ColorDisplay.displayName = "ColorDisplay";

export default ColorDisplay;
