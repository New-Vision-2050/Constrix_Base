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

// Employee details component
interface EmployeeDetailsSheetProps extends EmployeeDetailsProps {}

const EmployeeDetailsSheet: React.FC<EmployeeDetailsSheetProps> = ({
  isOpen,
  onClose,
  employee
}) => {
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
            <EmployeeInfoField label="اسم الموظف" value={employee.name} />
            <EmployeeInfoField label="رقم الجوال" value={employee.phone} className="flex justify-between items-center" />
            <EmployeeInfoField label="القسم" value={employee.department} className="flex justify-between items-center" />
            <EmployeeInfoField label="البريد الالكتروني" value={employee.email} className="flex justify-between items-center" />
            <EmployeeInfoField label="الفرع" value={employee.branch} className="flex justify-between items-center mb-2" />
            
            {/* Gender, Birth Date and Nationality */}
            <div className="flex justify-between mb-3 mt-4">
              <div className="bg-[#161F3E] p-2 rounded-md w-full text-center mx-1">
                <div className="text-gray-400 text-[10px] mb-1">الجنس</div>
                <div>{employee.gender}</div>
              </div>
              <div className="bg-[#161F3E] p-2 rounded-md w-full text-center mx-1">
                <div className="text-gray-400 text-[10px] mb-1">تاريخ الميلاد</div>
                <div>{employee.birthDate}</div>
              </div>
              <div className="bg-[#161F3E] p-2 rounded-md w-full text-center mx-1">
                <div className="text-gray-400 text-[10px] mb-1">الجنسية</div>
                <div>{employee.nationality}</div>
              </div>
            </div>
            
            {/* Attendance status and Employee status */}
            <div className="bg-[#161F3E] p-3 rounded-md mb-3">
              <EmployeeInfoField 
                label="حالة الحضور" 
                value={employee.attendanceStatus} 
                className="flex justify-between items-center"
              />
              
              <EmployeeInfoField 
                label="حالة الموظف" 
                value={employee.employeeStatus} 
                className="flex justify-between items-center"
              />
            </div>
            
            {/* Check-in and Check-out times */}
            {employee.checkInTime && (
              <div className="bg-[#161F3E] p-3 rounded-md">
                <div className="text-gray-400 text-[12px] mb-0.5">الحضور</div>
                <div className="text-right text-lg">{employee.checkInTime} صباحاً</div>
              </div>
            )}
            
            {employee.checkOutTime && (
              <div className="bg-[#161F3E] p-3 rounded-md mt-3">
                <div className="text-gray-400 text-[12px] mb-0.5">الانصراف</div>
                <div className="text-right text-lg">{employee.checkOutTime} مساءاً</div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};



export default EmployeeDetailsSheet;
