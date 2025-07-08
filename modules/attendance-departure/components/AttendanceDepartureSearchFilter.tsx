'use client';

import React, { ChangeEvent, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { staticBranches, staticDepartments, staticApprovers } from '../constants/static-data';
import { useAttendance } from '../context/AttendanceContext';

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
    refetchTeamAttendance
  } = useAttendance();

  // Handle search text change with debounce
  const handleSearchTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log("Setting search text to:", newValue);
    setSearchText(newValue);
    // Refetch data with a slight delay to allow for typing
    setTimeout(() => {
      console.log("Refetching with search text:", newValue);
      refetchTeamAttendance();
    }, 500);
  }, [setSearchText, refetchTeamAttendance]);

  // Handle select changes
  const handleApproverChange = useCallback((value: string) => {
    console.log("Setting approver to:", value);
    setSelectedApprover(value);
    setTimeout(() => {
      console.log("Refetching after approver change:", value);
      refetchTeamAttendance();
    }, 0);
  }, [setSelectedApprover, refetchTeamAttendance]);

  const handleDepartmentChange = useCallback((value: string) => {
    console.log("Setting department to:", value);
    setSelectedDepartment(value);
    setTimeout(() => {
      console.log("Refetching after department change:", value);
      refetchTeamAttendance();
    }, 0);
  }, [setSelectedDepartment, refetchTeamAttendance]);

  const handleBranchChange = useCallback((value: string) => {
    console.log("Setting branch to:", value);
    setSelectedBranch(value);
    setTimeout(() => {
      console.log("Refetching after branch change:", value);
      refetchTeamAttendance();
    }, 0);
  }, [setSelectedBranch, refetchTeamAttendance]);

  return (
    <div className="p-4 bg-[#140F35] rounded-lg mb-4">
      <h3 className="text-white mb-4 font-medium">فلتر البحث</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input 
          placeholder="الاسم/البريد الالكتروني/رقم الجوال" 
          className="bg-transparent text-white border-gray-600 border-1 rounded-md w-full ring-1 h-full ring-gray-600 focus:ring-gray-400 focus:border-purple-500 placeholder:text-gray-400"
          value={searchText}
          onChange={handleSearchTextChange}
        />
        
        <Select dir="rtl" value={selectedApprover} onValueChange={handleApproverChange}>
          <SelectTrigger className="bg-transparent text-white border-gray-600 focus:border-purple-500">
            <SelectValue placeholder="المحدد المعتمد" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            {staticApprovers.map(approver => (
              <SelectItem key={approver.value} value={approver.value}>{approver.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select dir="rtl" value={selectedDepartment} onValueChange={handleDepartmentChange}>
          <SelectTrigger className="bg-transparent text-white border-gray-600 focus:border-purple-500">
            <SelectValue placeholder="الإدارة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            {staticDepartments.map(department => (
              <SelectItem key={department.value} value={department.value}>{department.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select dir="rtl" value={selectedBranch} onValueChange={handleBranchChange}>
          <SelectTrigger className="bg-transparent text-white border-gray-600 focus:border-purple-500">
            <SelectValue placeholder="الفرع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            {staticBranches.map(branch => (
              <SelectItem key={branch.value} value={branch.value}>{branch.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AttendanceDepartureSearchFilter;
