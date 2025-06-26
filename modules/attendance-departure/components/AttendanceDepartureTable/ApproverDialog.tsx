"use client";

import React from "react";
import { useAttendance } from "../../context/AttendanceContext";
import DialogContainer from "../shared/DialogContainer";
import EmployeeInfoSection from "../shared/EmployeeInfoSection";

/**
 * Approver dialog component that appears when clicking on the approver cell in the table
 */
const ApproverDialog: React.FC = () => {
  const {
    isApproverDialogOpen,
    selectedApproverRecord,
    closeApproverDialog,
  } = useAttendance();

  if (!selectedApproverRecord) return null;

  return (
    <DialogContainer 
      isOpen={isApproverDialogOpen} 
      onClose={closeApproverDialog}
      title="بيانات محدد الحضور"
    >
      {/* Employee Information */}
      <EmployeeInfoSection record={selectedApproverRecord} />
      
      {/* Data Input Fields */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">اسم المحدد</label>
          <div className="bg-[#101026] border border-gray-700 rounded-md p-3 text-right">
            {selectedApproverRecord.approver || "فرع القاهرة"}
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">رقم المحدد</label>
          <div className="bg-[#101026] border border-gray-700 rounded-md p-3 text-right">
            مصمم
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">عدد الفترات</label>
          <div className="flex items-center">
            <div className="bg-[#101026] border border-gray-700 rounded-md p-2 text-center w-12 mx-2">
              2
            </div>
          </div>
        </div>
        
        {/* First Period */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">الفترة الأولى</label>
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="text-xs mx-1">من</span>
              <div className="flex">
                <div className="bg-[#E91E63] text-white p-2 rounded-l-md">PM</div>
                <div className="bg-[#101026] border border-gray-700 rounded-r-md p-2 text-center w-12">
                  2
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs mx-1">إلى</span>
              <div className="flex">
                <div className="bg-[#E91E63] text-white p-2 rounded-l-md">PM</div>
                <div className="bg-[#101026] border border-gray-700 rounded-r-md p-2 text-center w-12">
                  2
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Second Period */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">الفترة الثانية</label>
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="text-xs mx-1">من</span>
              <div className="flex">
                <div className="bg-[#E91E63] text-white p-2 rounded-l-md">PM</div>
                <div className="bg-[#101026] border border-gray-700 rounded-r-md p-2 text-center w-12">
                  8
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs mx-1">إلى</span>
              <div className="flex">
                <div className="bg-[#E91E63] text-white p-2 rounded-l-md">PM</div>
                <div className="bg-[#101026] border border-gray-700 rounded-r-md p-2 text-center w-12">
                  2
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-[#E91E63] text-left">
          عدد ساعات العمل: 8 ساعات
        </div>
      </div>
    </DialogContainer>
  );
};

export default ApproverDialog;
