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
// We no longer need static data, we use data from API
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
    // Fetch branches and supervisors data from Context
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
    <div className="p-4 bg-white dark:bg-[#140F35] border border-gray-200 dark:border-gray-700 rounded-lg mb-4 shadow-sm">
      <h3 className="text-gray-900 dark:text-white mb-4 font-medium">{t("title")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <label 
            htmlFor="branch-select"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            {t("branch")}
          </label>
          <Select
            dir="rtl"
            value={selectedBranch}
            onValueChange={handleBranchChange}
          >
            <SelectTrigger 
              id="branch-select" 
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800"
            >
              <SelectValue placeholder={t("branch")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              {/* عرض الفروع من الـ API مع عرض رسالة تحميل إذا كانت البيانات قيد التحميل */}
              {branchesLoading ? (
                <SelectItem value="loading" disabled>
                  {t("loadingBranches")}
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
        </div>

        <div className="flex flex-col gap-1">
          <label 
            htmlFor="department-select"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            {t("department")}
          </label>
          <Select
            dir="rtl"
            value={selectedDepartment}
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger 
              id="department-select" 
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800"
            >
              <SelectValue placeholder={t("department")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              {managementsLoading ? (
                <SelectItem value="loading" disabled>
                  {t("loadingDepartments")}
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
        </div>

        <div className="flex flex-col gap-1">
          <label 
            htmlFor="approver-select"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            {t("approver")}
          </label>
          <Select
            dir="rtl"
            value={selectedApprover}
            onValueChange={handleApproverChange}
          >
            <SelectTrigger 
              id="approver-select" 
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800"
            >
              <SelectValue placeholder={t("approver")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              {constraintsLoading ? (
                <SelectItem value="loading" disabled>{t("loadingApprovers")}</SelectItem>
              ) : (
                constraints?.map((constraint,index) => (
                  <SelectItem key={index} value={constraint.id}>
                    {constraint.constraint_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label 
            htmlFor="search-input"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            {t("searchPlaceholder")}
          </label>
          <Input
            id="search-input"
            placeholder={t("searchPlaceholder")}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            value={searchText}
            onChange={handleSearchTextChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceDepartureSearchFilter;
