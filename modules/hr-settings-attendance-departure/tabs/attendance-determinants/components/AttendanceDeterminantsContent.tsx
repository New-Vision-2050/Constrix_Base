import React from "react";
import DeterminantsList from "./DeterminantsList/DeterminantsList";
import { Constraint } from "../../../types/constraint-type";
import { useTranslations } from "next-intl";

interface AttendanceDeterminantsContentProps {
  determinants: Constraint[];
  onDeterminantClick: (id: string) => void;
}

/**
 * Content component for the attendance determinants tab
 * يمكن أن يستقبل props مباشرة أو استخدام السياق
 */
const AttendanceDeterminantsContent: React.FC<
  AttendanceDeterminantsContentProps
> = ({ determinants, onDeterminantClick }) => {
  // استخدام دالة الترجمة
  const t = useTranslations("HRSettingsAttendanceDepartureModule.attendanceDeterminants");
  return (
    <div className="p-4 flex flex-col items-center gap-4">
      {/* قائمة المحددات */}
      <DeterminantsList
        determinants={determinants}
        onClick={onDeterminantClick}
      />
    </div>
  );
};

export default AttendanceDeterminantsContent;
