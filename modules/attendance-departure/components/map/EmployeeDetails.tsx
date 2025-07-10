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

// Employee details component
interface EmployeeDetailsSheetProps extends EmployeeDetailsProps {}

const EmployeeDetailsSheet: React.FC<EmployeeDetailsSheetProps> = ({
  isOpen,
  onClose,
  employee
}) => {
  const t = useTranslations('AttendanceDepartureModule.EmployeeDetailsSheet');
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
        className="bg-[#10152C] text-white border-none shadow-none px-5 py-6 overflow-auto"
        style={{ maxWidth: '320px', zIndex: 9999 }}
      >
        <DialogTitle></DialogTitle>
        <div className="relative w-full">
          <SheetClose className="absolute left-1 top-1 text-gray-400 hover:text-white">
            <X size={22} />
          </SheetClose>
          
          <div className="flex flex-col items-center mb-6 mt-2">
            <div className="bg-gray-300 rounded-full w-16 h-16 flex items-center justify-center text-[#10152C] text-xl font-medium mb-3">
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
              <div className="bg-[#161F3E] p-2 rounded-md w-full text-center mx-1">
                <div className="text-gray-400 text-[10px] mb-1">{t('personalInfo.gender')}</div>
                <div>{employee.gender}</div>
              </div>
              <div className="bg-[#161F3E] p-2 rounded-md w-full text-center mx-1">
                <div className="text-gray-400 text-[10px] mb-1">{t('personalInfo.birthDate')}</div>
                <div>{employee.birthDate}</div>
              </div>
              <div className="bg-[#161F3E] p-2 rounded-md w-full text-center mx-1">
                <div className="text-gray-400 text-[10px] mb-1">{t('personalInfo.nationality')}</div>
                <div>{employee.nationality}</div>
              </div>
            </div>
            
            {/* Attendance status and Employee status */}
            <div className="bg-[#161F3E] p-3 rounded-md mb-3">
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
              <div className="bg-[#161F3E] p-3 rounded-md">
                <div className="text-gray-400 text-[12px] mb-0.5">{t('times.checkIn')}</div>
                <div className="text-right text-lg">{employee.checkInTime} {t('times.morning')}</div>
              </div>
            )}
            
            {employee.checkOutTime && (
              <div className="bg-[#161F3E] p-3 rounded-md mt-3">
                <div className="text-gray-400 text-[12px] mb-0.5">{t('times.checkOut')}</div>
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
