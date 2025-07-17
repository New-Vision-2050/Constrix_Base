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
// لم نعد بحاجة إلى البيانات الثابتة، نستخدم البيانات من API
import { useAttendance } from "../context/AttendanceContext";
import { useTranslations } from "next-intl";

const AttendanceDepartureSearchFilter: React.FC = () => {
  const t = useTranslations("AttendanceDepartureModule.SearchFilter");
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
    // جلب بيانات الفروع والمشرفين من Context
    branches,
    managements,
    constraints,
    branchesLoading,
    managementsLoading,
    constraintsLoading,
  } = useAttendance();

  // Handle search text change with debounce
  const handleSearchTextChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      setSearchText(newValue);
      // Refetch data with a slight delay to allow for typing
      setTimeout(() => {
        refetchTeamAttendance();
      }, 500);
    },
    [setSearchText, refetchTeamAttendance]
  );

  // Handle select changes
  const handleApproverChange = useCallback(
    (value: string) => {
      setSelectedApprover(value);
      setTimeout(() => {
        refetchTeamAttendance();
      }, 0);
    },
    [setSelectedApprover, refetchTeamAttendance]
  );

  const handleDepartmentChange = useCallback(
    (value: string) => {
      setSelectedDepartment(value);
      setTimeout(() => {
        refetchTeamAttendance();
      }, 0);
    },
    [setSelectedDepartment, refetchTeamAttendance]
  );

  const handleBranchChange = useCallback(
    (value: string) => {
      setSelectedBranch(value);
      setTimeout(() => {
        refetchTeamAttendance();
      }, 0);
    },
    [setSelectedBranch, refetchTeamAttendance]
  );

  return (
    <div className="p-4 bg-[#140F35] rounded-lg mb-4">
      <h3 className="text-white mb-4 font-medium">{t("title")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          dir="rtl"
          value={selectedBranch}
          onValueChange={handleBranchChange}
        >
          <SelectTrigger className="bg-transparent text-white border-gray-600 focus:border-purple-500">
            <SelectValue placeholder={t("branch")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
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
            <SelectValue placeholder={t("department")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
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
            <SelectValue placeholder={t("approver")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            {constraintsLoading ? (
              <SelectItem value="loading" disabled>{t("loadingApprovers")}</SelectItem>
            ) : (
              constraints?.map((constraint,index) => (
                <SelectItem key={constraint.id+'-'+index} value={constraint.id}>
                  {constraint.constraint_name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Input
          placeholder={t("searchPlaceholder")}
          className="bg-transparent text-white border-gray-600 border-1 rounded-md w-full ring-1 h-full ring-gray-600 focus:ring-gray-400 focus:border-purple-500 placeholder:text-gray-400"
          value={searchText}
          onChange={handleSearchTextChange}
        />
      </div>
    </div>
  );
};

export default AttendanceDepartureSearchFilter;
