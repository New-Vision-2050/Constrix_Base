import React from "react";
import { AttendanceDeterminant } from "../../../../../types/attendance-departure";
import { Check, AlertCircle, MapPin, CheckCircle2Icon } from "lucide-react";

interface DeterminantItemProps {
  determinant: AttendanceDeterminant;
  onClick?: (id: string) => void;
}

/**
 * Individual determinant item component
 */
const DeterminantItem: React.FC<DeterminantItemProps> = ({
  determinant,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(determinant.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-row-reverse items-center justify-between py-4 border-b border-opacity-20 border-gray-600 last:border-b-0 cursor-pointer`}
    >
      <div className="flex items-center justify-center">
        {determinant.status ? (
          <CheckCircle2Icon size={20} className="text-green-500" />
        ) : (
          <AlertCircle size={20} className="text-orange-500" />
        )}
      </div>
      <div className="flex flex-row-reverse items-center gap-2">
        <div className="text-right">
          <div
            className={`text-sm ${
              determinant.active ? "text-white font-bold" : "text-gray-400"
            }`}
          >
            محدد فرع
          </div>
          <div
            className={`text-sm ${
              determinant.active ? "text-white" : "text-gray-500"
            }`}
          >
            {determinant.location}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <MapPin size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default DeterminantItem;
