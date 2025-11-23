import { cn } from "@/lib/utils";

/**
 * ColorDisplay component
 * Shows color preview circle and hex value
 * 
 * @param color - Hex color value to display
 * @param onClick - Click handler for opening color picker
 */
interface ColorDisplayProps {
  color: string;
  onClick: () => void;
}

export default function ColorDisplay({ color, onClick }: ColorDisplayProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-2 py-1 rounded-lg",
        "bg-sidebar border border-border",
        "hover:border-primary transition-colors",
        "cursor-pointer w-full text-left"
      )}
    >
      {/* Color circle preview */}
      <div
        className="w-6 h-6 rounded-full border-2 border-white/20"
        style={{ backgroundColor: color }}
        aria-label="Color preview"
      />

      {/* Color hex value */}
      <span className="text-white font-mono text-sm">
        {color}
      </span>
    </button>
  );
}

