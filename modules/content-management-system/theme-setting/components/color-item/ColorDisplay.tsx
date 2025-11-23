import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { X } from "lucide-react";
import EmptyColorButton from "./EmptyColorButton";

/**
 * ColorDisplay component
 * Shows color preview or "Pick Color" button
 * 
 * @param color - Hex color value to display (can be undefined)
 * @param onClear - Handler for clearing the color
 */
interface ColorDisplayProps {
  color?: string;
  onClear?: () => void;
}

const ColorDisplay = forwardRef<HTMLButtonElement, ColorDisplayProps>(
  ({ color, onClear, ...props }, ref) => {
    // If no color selected, show "Pick Color" button
    if (!color) {
      return <EmptyColorButton ref={ref} {...props} />;
    }

    // If color is selected, show color preview with clear button
    return (
      <div className="flex items-center gap-2 w-full">
        <button
          ref={ref}
          type="button"
          className={cn(
            "flex items-center gap-3 px-2 py-1 rounded-lg flex-1",
            "bg-sidebar border border-border",
            "hover:border-primary transition-colors",
            "cursor-pointer text-left"
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
          <span className="font-mono text-sm">{color}</span>
        </button>

        {/* Clear button */}
        {onClear && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className={cn(
              "p-2 rounded-lg",
              "bg-sidebar border border-border",
              "hover:border-destructive hover:text-destructive",
              "transition-colors"
            )}
            aria-label="Clear color"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

ColorDisplay.displayName = "ColorDisplay";

export default ColorDisplay;
