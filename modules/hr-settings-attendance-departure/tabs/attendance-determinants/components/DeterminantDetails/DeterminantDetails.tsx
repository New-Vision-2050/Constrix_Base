import React from "react";
import { Check, Square } from "lucide-react";

interface DeterminantDetailsProps {
  title: string;
  systemType: string;
  systemStatus: string;
  workHours: number;
  workDays: string[];
  branches: string[];
}

/**
 * Component to display determinant details in a card format
 */
const DeterminantDetails: React.FC<DeterminantDetailsProps> = ({
  title,
  systemType,
  systemStatus,
  workHours,
  workDays,
  branches,
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

  return (
    <div className="bg-transparent border border-white text-white rounded-xl p-6 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white opacity-30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Vertical dots menu */}
      <div className="absolute top-6 left-6 flex flex-col gap-1 z-10">
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>

      {/* Title */}
      <div className="text-right text-2xl font-bold mb-8 relative z-10">
        {title}
      </div>

      {/* System type */}
      <div className="bg-[#161F3E] p-3 rounded-md mt-3">
        <div className="text-gray-400 text-[12px] mb-0.5">نظام المحدد</div>
        <div className="text-right text-lg">{systemType}</div>
      </div>

      {/* Work hours */}
      <div className="bg-[#161F3E] p-3 rounded-md mt-3">
        <div className="text-gray-400 text-[12px] mb-0.5">عدد ساعات العمل</div>
        <div className="text-right text-lg">{workHours} ساعات</div>
      </div>

      {/* Work days */}
      <div className="bg-[#161F3E] p-3 rounded-md mt-3">
        <div className="grid grid-cols-3 gap-x-8 gap-y-4 text-center">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className="flex flex-row-reverse items-center justify-center gap-2"
            >
              {workDays.includes(day) ? (
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
      <div className="bg-[#161F3E] p-3 rounded-md mt-3">
        <div className="text-right text-gray-400 mb-3">الفرع*</div>
        <div className="flex flex-row-reverse gap-3 justify-end">
          {branches.map((branch, index) => (
            <div
              key={index}
              className="bg-[#2A2045] hover:bg-[#2A2045]/80 transition-colors rounded-full px-6 py-2 text-white"
            >
              فرع {branch}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeterminantDetails;
