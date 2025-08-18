/**
 * Policy toggle component - displays a toggle option with label
 */
import React from "react";
import { Square, SquareCheckBig } from "lucide-react";


interface PolicyToggleProps {
  /** Label for the toggle */
  label: string;
  /** Label for the toggle when enabled */
  enabledLabel: string;
  /** Label for the toggle when disabled */
  disabledLabel: string;
  /** Whether the toggle is enabled */
  enabled: boolean;
}

/**
 * Displays a toggle switch with label for policy options
 */
const PolicyToggle: React.FC<PolicyToggleProps> = ({
  label,
  enabledLabel,
  disabledLabel,
  enabled,
}) => {

  return (
    <div className="bg-[#140f35] p-2 flex flex-col justify-between mb-2">
      <span className="text-base font-thin text-gray-500">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <div className="relative">
          {enabled ? (
            <SquareCheckBig className="h-5 w-5 rounded-full text-pink-500" />
          ) : (
            <Square className="h-5 w-5 rounded-full text-gray-600" />
          )}
        </div>
        <span className="text-sm font-medium">
          {enabled ? enabledLabel : disabledLabel}
        </span>
      </div>
    </div>
  );
};

export default PolicyToggle;
