"use client";

import React from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { EmployeeDetailsProps } from "../../types/employee";
import EmployeeInfoField from "../../components/shared/EmployeeInfoField";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import useMapEmpAttendance from "../../hooks/useMapEmpAttendance";
import AttendanceHistoryList from "./AttendanceHistoryList";
import { AttendanceHistory } from "./types";

// Constants
const SHEET_Z_INDEX = 9999; // High z-index to ensure sheet appears above other UI elements

// Employee details component
const EmployeeDetailsSheet: React.FC<EmployeeDetailsProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  const t = useTranslations("AttendanceDepartureModule.EmployeeDetailsSheet");

  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";
  
  // Fetch attendance history for selected employee
  const { 
    data: attendanceHistory, 
    isLoading, 
    error 
  } = useMapEmpAttendance(employee?.user_id || "");

  // Theme specific colors defined with Tailwind classes
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const subtitleColor = isDarkMode ? "text-gray-400" : "text-gray-500";

  if (!employee) return null;

  // Get initials from employee name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className={`${textColor} border-none shadow-none px-5 py-6 overflow-auto bg-white dark:bg-[#10152C] max-w-[320px]`}
        style={{ zIndex: SHEET_Z_INDEX }}
      >
        {/* ! DialogTitle required in sheet,if removed case an error */}
        <DialogTitle className="sr-only"></DialogTitle>

        <div className="relative w-full">
          <SheetClose
            className={`absolute left-1 top-1 ${subtitleColor} ${
              isDarkMode ? "hover:text-white" : "hover:text-gray-700"
            }`}
          >
            <X size={22} />
          </SheetClose>

          <div className="flex flex-col items-center mb-6 mt-2">
            <div
              className={`${
                isDarkMode
                  ? "bg-gray-300 text-[#10152C]"
                  : "bg-gray-600 text-white"
              } rounded-full w-16 h-16 flex items-center justify-center text-xl font-medium mb-3`}
            >
              {getInitials(employee.name)}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <EmployeeInfoField
              label={t("fields.employeeName")}
              value={employee.name}
            />
            <EmployeeInfoField
              label={t("fields.phone")}
              value={employee.phone}
            />
            <EmployeeInfoField
              label={t("fields.management")}
              value={employee.management}
            />
            <EmployeeInfoField
              label={t("fields.email")}
              value={employee.email}
            />
            <EmployeeInfoField
              label={t("fields.branch")}
              value={employee.branch}
            />

            {/* Gender, Birth Date and Nationality */}
            <div className="flex justify-between mb-3 mt-4">
              <div className="p-2 rounded-md w-full text-center mx-1 bg-[#f0f2f5] dark:bg-[#161F3E]">
                <div className={`${subtitleColor} text-[10px] mb-1`}>
                  {t("personalInfo.gender")}
                </div>
                <div>{employee.gender}</div>
              </div>
              <div className="p-2 rounded-md w-full text-center mx-1 bg-[#f0f2f5] dark:bg-[#161F3E]">
                <div className={`${subtitleColor} text-[10px] mb-1`}>
                  {t("personalInfo.birthDate")}
                </div>
                <div>
                  {employee.birthDate
                    ? new Date(employee.birthDate).toLocaleDateString()
                    : "-"}
                </div>
              </div>
              <div className="p-2 rounded-md w-full text-center mx-1 bg-[#f0f2f5] dark:bg-[#161F3E]">
                <div className={`${subtitleColor} text-[10px] mb-1`}>
                  {t("personalInfo.nationality")}
                </div>
                <div>{employee.nationality}</div>
              </div>
            </div>

            {/* Show attendance history */}
            <div className="pt-4 mt-4 border-t dark:border-gray-700">
              <AttendanceHistoryList
                attendanceHistory={attendanceHistory}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeDetailsSheet;
