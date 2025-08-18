/**
 * Branch item component - displays a single branch with selection state
 */
import React from "react";
import { Check, CircleCheckBig, MapPin } from "lucide-react";

interface BranchItemProps {
  /** Label text to display */
  label: string;
  /** Whether the branch is currently active/selected */
  isActive: boolean;
  /** Handler for when the branch is clicked */
  onClick?: () => void;
}

/**
 * Displays a branch item with selection indicator and location icon
 */
const BranchItem: React.FC<BranchItemProps> = ({
  label,
  isActive,
  onClick,
}) => {
  return (
    <div
      className={`
        flex items-center justify-between p-3 rounded-lg cursor-pointer
        ${isActive ? "bg-[#19103B]" : "bg-[#140F35] hover:bg-opacity-80"}
      `}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-white" />
        <span className="text-lg font-medium text-white">{label}</span>
      </div>

      {/* Check mark for selected branch */}
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isActive ? "text-green-500" : "text-gray-700"
        }`}
      >
        {isActive && <CircleCheckBig className="w-4 h-4" />}
      </div>
    </div>
  );
};

export default BranchItem;
