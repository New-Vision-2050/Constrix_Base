"use client";

import React from "react";
import { X } from "lucide-react";
import { useAttendance } from "../../context/AttendanceContext";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { EmployeeDetailsProps } from "../../types/employee";

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
            <div className="flex justify-between items-center">
              <span className="text-[#FF3B8B] font-medium">اسم الموظف:</span>
              <span className="text-right">{employee.name}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[#FF3B8B] font-medium">رقم الجوال:</span>
              <span className="text-right">‎+{employee.phone}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[#FF3B8B] font-medium">القسم:</span>
              <span className="text-right">{employee.department}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[#FF3B8B] font-medium">البريد الالكتروني:</span>
              <span className="text-right">{employee.email}</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#FF3B8B] font-medium">الفرع:</span>
              <span className="text-right">{employee.branch}</span>
            </div>
            
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
              <div className="flex justify-between items-center">
                <span className="text-[#FF3B8B] font-medium">حالة الحضور:</span>
                <span className="text-right font-bold text-green-500">{employee.attendanceStatus}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#FF3B8B] font-medium">حالة الموظف:</span>
                <span className="text-right font-bold">{employee.employeeStatus}</span>
              </div>
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
