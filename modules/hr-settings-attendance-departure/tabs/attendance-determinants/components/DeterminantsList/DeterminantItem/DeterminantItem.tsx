import React from "react";
import { AttendanceDeterminant } from "../../../../../types/attendance-departure";
import { Check, AlertCircle, MapPin, CheckCircle2Icon } from "lucide-react";
import { Constraint } from "@/modules/hr-settings-attendance-departure/types/constraint-type";
import { useAttendanceDeterminants } from "../../../context/AttendanceDeterminantsContext";
import { useTheme } from "next-themes";

interface DeterminantItemProps {
  determinant: Constraint;
  onClick?: (id: string) => void;
}

/**
 * Individual determinant item component
 */
const DeterminantItem: React.FC<DeterminantItemProps> = ({
  determinant,
  onClick,
}) => {
  const { activeConstraint } = useAttendanceDeterminants();
  const isActive = activeConstraint?.id === determinant.id;
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors
  const borderColor = isDarkMode ? 'border-gray-600 border-opacity-20' : 'border-gray-200';
  const activeTextTitle = isDarkMode ? 'text-white font-bold' : 'text-gray-900 font-bold';
  const inactiveTextTitle = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const activeTextSubtitle = isDarkMode ? 'text-white' : 'text-gray-800';
  const inactiveTextSubtitle = isDarkMode ? 'text-gray-500' : 'text-gray-500';
  const iconColor = isDarkMode ? 'text-white' : 'text-gray-600';
  const handleClick = () => {
    if (onClick) {
      onClick(determinant.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-row-reverse items-center justify-between py-4 border-b ${borderColor} last:border-b-0 cursor-pointer`}
    >
      <div className="flex items-center justify-center">
        {determinant.is_active ? (
          <CheckCircle2Icon size={20} className="text-green-500" />
        ) : (
          <AlertCircle size={20} className="text-orange-500" />
        )}
      </div>
      <div className="flex flex-row-reverse items-center gap-2">
        <div className="text-right">
          <div
            className={`text-sm ${isActive ? activeTextTitle : inactiveTextTitle}`}
          >
            محدد فرع
          </div>
          <div
            className={`text-sm ${isActive ? activeTextSubtitle : inactiveTextSubtitle}`}
          >
            {determinant.constraint_name}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <MapPin size={20} className={iconColor} />
        </div>
      </div>
    </div>
  );
};

export default DeterminantItem;
