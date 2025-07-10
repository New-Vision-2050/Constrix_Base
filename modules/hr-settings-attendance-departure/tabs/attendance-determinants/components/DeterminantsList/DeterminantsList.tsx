import React from "react";
import DeterminantItem from "./DeterminantItem/DeterminantItem";
import { MapPin } from "lucide-react";
import { Constraint } from "@/modules/hr-settings-attendance-departure/types/constraint-type";
import { useAttendanceDeterminants } from "../../context/AttendanceDeterminantsContext";
import { useTranslations } from "next-intl";

interface DeterminantsListProps {
  determinants: Constraint[];
  onClick: (id: string) => void;
}

/**
 * Component to display a list of attendance determinants
 * Puede recibir props directamente o usar el contexto
 */
const DeterminantsList: React.FC<DeterminantsListProps> = ({
  determinants,
  onClick,
}) => {
  const { activeConstraint } = useAttendanceDeterminants();
  const isActive = !Boolean(activeConstraint);
  // استخدام hook الترجمة للوصول إلى مفاتيح الترجمة
  const t = useTranslations("HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantsList");

  return (
    <div className="bg-[#1A103C] rounded-lg overflow-hidden  mx-auto">
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-purple-800/30 cursor-pointer hover:bg-[#2A204C] transition-colors"
        onClick={() => onClick("all-determinants")}
      >
        <MapPin size={16} className={`${isActive ? "text-white" : "text-gray-400"}`} />
        <div className={`${isActive ? "text-white" : "text-gray-400"} text-sm font-medium`}>{t('allDeterminants')}</div>
      </div>
      <div className="px-4">
        {determinants.map((determinant) => (
          <DeterminantItem
            key={determinant.id}
            determinant={determinant}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default DeterminantsList;
