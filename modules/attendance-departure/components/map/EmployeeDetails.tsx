"use client";

import React from "react";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { EmployeeDetailsProps } from "../../types/employee";
import EmployeeInfoField from "../../components/shared/EmployeeInfoField";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

// Constants
const SHEET_Z_INDEX = 9999; // High z-index to ensure sheet appears above other UI elements

// Employee details component
const EmployeeDetailsSheet: React.FC<EmployeeDetailsProps> = ({
  isOpen,
  onClose,
  employee
}) => {
  const t = useTranslations('AttendanceDepartureModule.EmployeeDetailsSheet');
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme specific colors defined with Tailwind classes
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const subtitleColor = isDarkMode ? "text-gray-400" : "text-gray-500";
  
  if (!employee) return null;

  // Get initials from employee name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map(part => part.charAt(0))
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
          <SheetClose className={`absolute left-1 top-1 ${subtitleColor} ${isDarkMode ? 'hover:text-white' : 'hover:text-gray-700'}`}>
            <X size={22} />
          </SheetClose>
          
          <div className="flex flex-col items-center mb-6 mt-2">
            <div className={`${isDarkMode ? 'bg-gray-300 text-[#10152C]' : 'bg-gray-600 text-white'} rounded-full w-16 h-16 flex items-center justify-center text-xl font-medium mb-3`}>
              {getInitials(employee.name)}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <EmployeeInfoField label={t('fields.employeeName')} value={employee.name} />
            <EmployeeInfoField label={t('fields.phone')} value={employee.phone} className="flex justify-between items-center" />
            <EmployeeInfoField label={t('fields.department')} value={employee.department} className="flex justify-between items-center" />
            <EmployeeInfoField label={t('fields.email')} value={employee.email} className="flex justify-between items-center" />
            <EmployeeInfoField label={t('fields.branch')} value={employee.branch} className="flex justify-between items-center mb-2" />
            
            {/* Gender, Birth Date and Nationality */}
            <div className="flex justify-between mb-3 mt-4">
              <div className="p-2 rounded-md w-full text-center mx-1 bg-[#f0f2f5] dark:bg-[#161F3E]">
                <div className={`${subtitleColor} text-[10px] mb-1`}>{t('personalInfo.gender')}</div>
                <div>{employee.gender}</div>
              </div>
              <div className="p-2 rounded-md w-full text-center mx-1 bg-[#f0f2f5] dark:bg-[#161F3E]">
                <div className={`${subtitleColor} text-[10px] mb-1`}>{t('personalInfo.birthDate')}</div>
                <div>{employee.birthDate}</div>
              </div>
              <div className="p-2 rounded-md w-full text-center mx-1 bg-[#f0f2f5] dark:bg-[#161F3E]">
                <div className={`${subtitleColor} text-[10px] mb-1`}>{t('personalInfo.nationality')}</div>
                <div>{employee.nationality}</div>
              </div>
            </div>
            
            {/* Attendance status and Employee status */}
            <div className="p-3 rounded-md mb-3 bg-[#f0f2f5] dark:bg-[#161F3E]">
              <EmployeeInfoField 
                label={t('status.attendanceStatus')} 
                value={employee.attendanceStatus} 
                className="flex justify-between items-center"
              />
              
              <EmployeeInfoField 
                label={t('status.employeeStatus')} 
                value={employee.employeeStatus} 
                className="flex justify-between items-center"
              />
            </div>
            
            {/* Check-in and Check-out times */}
            {employee.checkInTime && (
              <div className="p-3 rounded-md bg-[#f0f2f5] dark:bg-[#161F3E]">
                <div className={`${subtitleColor} text-[12px] mb-0.5`}>{t('times.checkIn')}</div>
                <div className="text-right text-lg">{employee.checkInTime} {t('times.morning')}</div>
              </div>
            )}
            
            {employee.checkOutTime && (
              <div className="p-3 rounded-md mt-3 bg-[#f0f2f5] dark:bg-[#161F3E]">
                <div className={`${subtitleColor} text-[12px] mb-0.5`}>{t('times.checkOut')}</div>
                <div className="text-right text-lg">{employee.checkOutTime} {t('times.afternoon')}</div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};



export default EmployeeDetailsSheet;
