"use client";

import React, { ChangeEvent, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { staticDepartments, staticApprovers } from "../constants/static-data";
import { useAttendance } from "../context/AttendanceContext";

const AttendanceDepartureSearchFilter: React.FC = () => {
  // Get the search state and updater functions from the context
  const {
    searchText,
    setSearchText,
    selectedApprover,
    setSelectedApprover,
    selectedDepartment,
    setSelectedDepartment,
    selectedBranch,
    setSelectedBranch,
    refetchTeamAttendance,
    // جلب بيانات الفروع من Context
    branches,
    managements,
    branchesLoading,
    managementsLoading,
  } = useAttendance();

  // Handle search text change with debounce
  const handleSearchTextChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      console.log("Setting search text to:", newValue);
      setSearchText(newValue);
      // Refetch data with a slight delay to allow for typing
      setTimeout(() => {
        console.log("Refetching with search text:", newValue);
        refetchTeamAttendance();
      }, 500);
    },
    [setSearchText, refetchTeamAttendance]
  );

  // Handle select changes
  const handleApproverChange = useCallback(
    (value: string) => {
      console.log("Setting approver to:", value);
      setSelectedApprover(value);
      setTimeout(() => {
        console.log("Refetching after approver change:", value);
        refetchTeamAttendance();
      }, 0);
    },
    [setSelectedApprover, refetchTeamAttendance]
  );

  const handleDepartmentChange = useCallback(
    (value: string) => {
      console.log("Setting department to:", value);
      setSelectedDepartment(value);
      setTimeout(() => {
        console.log("Refetching after department change:", value);
        refetchTeamAttendance();
      }, 0);
    },
    [setSelectedDepartment, refetchTeamAttendance]
  );

  const handleBranchChange = useCallback(
    (value: string) => {
      console.log("Setting branch to:", value);
      setSelectedBranch(value);
      setTimeout(() => {
        console.log("Refetching after branch change:", value);
        refetchTeamAttendance();
      }, 0);
    },
    [setSelectedBranch, refetchTeamAttendance]
  );

  console.log("branches", branches);

  return (
    <div className="p-4 bg-[#140F35] rounded-lg mb-4">
      <h3 className="text-white mb-4 font-medium">فلتر البحث</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          dir="rtl"
          value={selectedBranch}
          onValueChange={handleBranchChange}
        >
          <SelectTrigger className="bg-transparent text-white border-gray-600 focus:border-purple-500">
            <SelectValue placeholder="الفرع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            {/* عرض الفروع من الـ API مع عرض رسالة تحميل إذا كانت البيانات قيد التحميل */}
            {branchesLoading ? (
              <SelectItem value="loading" disabled>
                جاري تحميل الفروع...
              </SelectItem>
            ) : (
              branches?.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Select
          dir="rtl"
          value={selectedDepartment}
          onValueChange={handleDepartmentChange}
        >
          <SelectTrigger className="bg-transparent text-white border-gray-600 focus:border-purple-500">
            <SelectValue placeholder="الإدارة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            {managementsLoading ? (
              <SelectItem value="loading" disabled>
                جاري تحميل الفروع...
              </SelectItem>
            ) : (
              managements?.map((management) => (
                <SelectItem key={management.id} value={management.id}>
                  {management.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Select
          dir="rtl"
          value={selectedApprover}
          onValueChange={handleApproverChange}
        >
          <SelectTrigger className="bg-transparent text-white border-gray-600 focus:border-purple-500">
            <SelectValue placeholder="المحدد المعتمد" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            {staticApprovers.map((approver) => (
              <SelectItem key={approver.value} value={approver.value}>
                {approver.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="الاسم/البريد الالكتروني/رقم الجوال"
          className="bg-transparent text-white border-gray-600 border-1 rounded-md w-full ring-1 h-full ring-gray-600 focus:ring-gray-400 focus:border-purple-500 placeholder:text-gray-400"
          value={searchText}
          onChange={handleSearchTextChange}
        />
      </div>
    </div>
  );
};

export default AttendanceDepartureSearchFilter;
