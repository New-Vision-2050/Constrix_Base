import React, { useState } from "react";
import { Check, MoreVertical } from "lucide-react";
import { Constraint } from "@/modules/hr-settings-attendance-departure/types/constraint-type";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

interface DeterminantDetailsProps {
  constraint: Constraint;
  onEdit?: (constraint: Constraint) => void;
}

/**
 * Component to display constraint details in a card format
 */
const DeterminantDetails: React.FC<DeterminantDetailsProps> = ({
  constraint,
  onEdit,
}) => {
  // State for dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle edit button click
  const handleEdit = () => {
    // Close dropdown after clicking
    setShowDropdown(false);
    // Call onEdit prop if provided
    if (onEdit) {
      onEdit(constraint);
    }
  };
  // استخدام hook الترجمة
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminantDetails"
  );

  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  // Theme specific colors
  const cardBg = isDarkMode ? "bg-transparent" : "bg-white";
  const cardBorder = isDarkMode ? "border-white" : "border-gray-200";
  const cardText = isDarkMode ? "text-white" : "text-gray-900";
  const sectionBg = isDarkMode ? "bg-[#161F3E]" : "bg-gray-50";
  const sectionTextLabel = isDarkMode ? "text-gray-400" : "text-gray-500";
  const sectionTextContent = isDarkMode ? "text-white" : "text-gray-800";
  const dropdownBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const dropdownHover = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const dropdownText = isDarkMode ? "text-gray-200" : "text-gray-700";
  const iconBgHover = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200";
  const iconColor = isDarkMode ? "text-gray-300" : "text-gray-500";
  const branchTagBg = isDarkMode ? "bg-[#2A2045]" : "bg-gray-200";
  const branchTagHover = isDarkMode
    ? "hover:bg-[#2A2045]/80"
    : "hover:bg-gray-300";
  // Days of the week in Arabic
  const daysOfWeek = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];
  // Get weekly schedule from constraint config if available
  const weeklySchedule = constraint.config?.time_rules?.weekly_schedule || {};

  // Extract branches names from branches array
  const branchNames = constraint.branches?.map((branch) => branch.name) || [];

  // Map English day names to Arabic
  const dayNameMap: { [key: string]: string } = {
    sunday: "الأحد",
    monday: "الاثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
  };

  // Calculate active work days
  const activeDays = Object.entries(weeklySchedule)
    .filter(([_, config]) => config?.enabled)
    .map(([day]) => dayNameMap[day] || "");

  // Calculate total working hours per week if available
  const calculateTotalHours = () => {
    let total = 0;
    Object.values(weeklySchedule).forEach((day) => {
      if (day?.enabled && day?.periods) {
        day.periods.forEach((interval) => {
          // Calculate hours between start and end time if they exist
          if (interval.start_time && interval.end_time) {
            const start = new Date(`2000-01-01T${interval.start_time}`);
            const end = new Date(`2000-01-01T${interval.end_time}`);
            const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            total += diff;
          }
        });
      }
    });
    return Math.round(total);
  };

  const totalHours = calculateTotalHours();

  return (
    <div
      className={`${cardBg} border ${cardBorder} ${cardText} rounded-xl p-2 relative overflow-hidden shadow-sm`}
    >
      {/* Title with dropdown menu */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="text-2xl font-bold">
          {constraint.name || constraint.constraint_name}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`p-1 ${iconBgHover} rounded-full focus:outline-none`}
            aria-label="القائمة"
          >
            <MoreVertical size={20} className={iconColor} />
          </button>
          {showDropdown && (
            <div
              className={`absolute left-0 mt-2 w-32 ${dropdownBg} rounded-md shadow-lg z-20 border ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => handleEdit()}
                className={`w-full text-right px-4 py-2 text-sm ${dropdownText} ${dropdownHover} rounded-md`}
              >
                تعديل
              </button>
            </div>
          )}
        </div>
      </div>

      {/* System type */}
      <div className={`${sectionBg} p-3 rounded-md mt-3 shadow-sm`}>
        <div className={`${sectionTextLabel} text-[12px] mb-0.5`}>
          {t("determinantType")}
        </div>
        <div className={`${sectionTextContent} text-lg`}>
          {constraint.constraint_type ??
            t("systemNotFound", { default: "نظام غير موجود" })}
        </div>
      </div>

      {/* Work hours */}
      <div className={`${sectionBg} p-3 rounded-md mt-3 shadow-sm`}>
        <div className={`${sectionTextLabel} text-[12px] mb-0.5`}>
          {t("workHours")}
        </div>
        <div className={`${sectionTextContent} text-lg`}>
          {totalHours || 0} {t("hours", { default: "ساعات" })}
        </div>
      </div>

      {/* Work days */}
      <div className={`${sectionBg} p-3 rounded-md mt-3 shadow-sm`}>
        <div className={`${sectionTextLabel} text-[12px] mb-0.5`}>
          {t("workdays")}
        </div>
        <div className="grid grid-cols-3 gap-x-8 gap-y-4 text-center">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className="flex flex-row-reverse items-center justify-center gap-2"
            >
              {activeDays.includes(day) ? (
                <div className="bg-pink-500 w-5 h-5 flex items-center justify-center rounded">
                  <Check size={14} className="text-white" />
                </div>
              ) : (
                <div
                  className={`${
                    isDarkMode ? "bg-gray-500" : "bg-gray-300"
                  } w-5 h-5 flex items-center justify-center rounded`}
                />
              )}
              <div className="text-lg">{day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Branches */}
      {constraint.branch_locations.length > 0 && (
        <div className={`${sectionBg} p-3 rounded-md mt-3 shadow-sm`}>
          <div className={`${sectionTextLabel} mb-3`}>{t("branches")}</div>
          <div className="flex flex-row-reverse gap-3 justify-end flex-wrap">
            {constraint.branch_locations.map((branch, index) => (
              <div
                key={index}
                className={`${branchTagBg} ${branchTagHover} transition-colors rounded-full px-6 py-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                فرع {branch.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {constraint.notes && (
        <div className={`${sectionBg} p-3 rounded-md mt-3 shadow-sm`}>
          <div className={`${sectionTextLabel} text-[12px] mb-0.5`}>
            {t("notes", { default: "ملاحظات" })}
          </div>
          <div className={`${sectionTextContent} text-lg`}>
            {constraint.notes}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeterminantDetails;
