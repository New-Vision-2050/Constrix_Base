import React from "react";
import { Check } from "lucide-react";
import { Constraint } from "@/modules/hr-settings-attendance-departure/types/constraint-type";

interface DeterminantDetailsProps {
  constraint: Constraint;
}

/**
 * Component to display constraint details in a card format
 */
const DeterminantDetails: React.FC<DeterminantDetailsProps> = ({
  constraint,
}) => {
  // Days of the week in Arabic
  const daysOfWeek = [
    "الأربعاء",
    "الاحد",
    "الخميس",
    "الاثنين",
    "الجمعة",
    "الثلاثاء",
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
    <div className="bg-transparent border border-white text-white rounded-xl p-2 relative overflow-hidden">
      {/* Title */}
      <div className=" text-2xl font-bold mb-8 relative z-10">
        {constraint.name || constraint.constraint_name}
      </div>

      {/* System type */}
      <div className="bg-[#161F3E] p-3 rounded-md mt-3">
        <div className="text-gray-400 text-[12px] mb-0.5">نظام المحدد</div>
        <div className=" text-lg">
          {constraint.constraint_type ?? "نظام غير موجود"}
        </div>
      </div>

      {/* Work hours */}
      <div className="bg-[#161F3E] p-3 rounded-md mt-3">
        <div className="text-gray-400 text-[12px] mb-0.5">عدد ساعات العمل</div>
        <div className=" text-lg">{totalHours || 0} ساعات</div>
      </div>

      {/* Work days */}
      <div className="bg-[#161F3E] p-3 rounded-md mt-3">
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
                <div className="bg-gray-500 w-5 h-5 flex items-center justify-center rounded" />
              )}
              <div className="text-lg">{day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Branches */}
      {branchNames.length > 0 && (
        <div className="bg-[#161F3E] p-3 rounded-md mt-3">
          <div className=" text-gray-400 mb-3">الفرع*</div>
          <div className="flex flex-row-reverse gap-3 justify-end">
            {branchNames.map((branch, index) => (
              <div
                key={index}
                className="bg-[#2A2045] hover:bg-[#2A2045]/80 transition-colors rounded-full px-6 py-2 text-white"
              >
                فرع {branch}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {constraint.notes && (
        <div className="bg-[#161F3E] p-3 rounded-md mt-3">
          <div className="text-gray-400 text-[12px] mb-0.5">ملاحظات</div>
          <div className=" text-lg">{constraint.notes}</div>
        </div>
      )}
    </div>
  );
};

export default DeterminantDetails;
