"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { EmployeeDetails } from "../types/employee";
import { AttendanceStatusRecord } from "../types/attendance";
import { useTeamAttendance } from "../hooks/useTeamAttendance";
import { useAttendanceSummary } from "../hooks/useAttendanceSummary";
import { AttendanceSummaryData } from "../api/attendanceSummary";
import { SelectOption } from "@/types/select-option";
import { useBranches } from "../hooks/useBranches";
import { ManagementHierarchyItem, useManagementHierarchies } from "../hooks/useManagementHierarchies";
import { useManagements } from "../hooks/useManagements";

// Define the type of data in the context
interface AttendanceContextType {
  // Display state: table or map
  view: "table" | "map";
  // toggle view function
  toggleView: (view: "table" | "map") => void;
  
  // Team attendance data for map display
  teamAttendance: AttendanceStatusRecord[];
  teamAttendanceLoading: boolean;
  teamAttendanceError: Error | null;
  refetchTeamAttendance: () => void;

  // Attendance summary data for statistics cards
  attendanceSummary: AttendanceSummaryData | null;
  attendanceSummaryLoading: boolean;
  attendanceSummaryError: Error | null;
  refetchAttendanceSummary: () => void;

  // Date range for filtering
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  
  // Search filters
  searchText: string;
  setSearchText: (text: string) => void;
  selectedApprover: string;
  setSelectedApprover: (approver: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  
  // Branch data from API
  branches: ManagementHierarchyItem[]|undefined;
  branchesLoading: boolean;
  branchesError: Error | null;
  refetchBranches: () => void;

  // Management data from API
  managements: ManagementHierarchyItem[]|undefined;
  managementsLoading: boolean;
  managementsError: Error | null;
  refetchManagements: () => void;
  
  // Employee details dialog state
  isEmployeeDialogOpen: boolean;
  setEmployeeDialogOpen: (isOpen: boolean) => void;
  
  // Selected employee data
  selectedEmployee: EmployeeDetails | null;
  setSelectedEmployee: (employee: EmployeeDetails | null) => void;
  
  // Attendance status dialog state
  isAttendanceStatusDialogOpen: boolean;
  setAttendanceStatusDialogOpen: (isOpen: boolean) => void;
  
  // Selected attendance record data
  selectedAttendanceRecord: AttendanceStatusRecord | null;
  setSelectedAttendanceRecord: (record: AttendanceStatusRecord | null) => void;
  
  // Approver dialog state
  isApproverDialogOpen: boolean;
  setApproverDialogOpen: (isOpen: boolean) => void;
  
  // Selected approver record data
  selectedApproverRecord: AttendanceStatusRecord | null;
  setSelectedApproverRecord: (record: AttendanceStatusRecord | null) => void;
  
  // Functions to open and close the employee dialog
  openEmployeeDialog: (employee: EmployeeDetails) => void;
  closeEmployeeDialog: () => void;
  
  // Functions to open and close the attendance status dialog
  openAttendanceStatusDialog: (record: AttendanceStatusRecord) => void;
  closeAttendanceStatusDialog: () => void;
  
  // Functions to open and close the approver dialog
  openApproverDialog: (record: AttendanceStatusRecord) => void;
  closeApproverDialog: () => void;
}

// Create the context
export const AttendanceContext = createContext<
  AttendanceContextType | undefined
>(undefined);

// Provider component
interface AttendanceProviderProps {
  children: ReactNode;
}

export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({
  children,
}) => {
  // Display state: table or map
  const [view, setView] = useState<"table" | "map">("table");
  
  // Date range for filtering
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  
  // Search filter states with default values
  const [searchText, setSearchText] = useState<string>("");
  const [selectedApprover, setSelectedApprover] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  
  // Enhanced setters that also trigger refetch directly
  const updateSearchText = useCallback((text: string) => {
    console.log("Context updating search text to:", text);
    setSearchText(text);
  }, []);
  
  const updateSelectedApprover = useCallback((value: string) => {
    console.log("Context updating approver to:", value);
    setSelectedApprover(value);
  }, []);
  
  const updateSelectedDepartment = useCallback((value: string) => {
    console.log("Context updating department to:", value);
    setSelectedDepartment(value);
  }, []);
  
  const updateSelectedBranch = useCallback((value: string) => {
    console.log("Context updating branch to:", value);
    setSelectedBranch(value);
  }, []);
  
  // Debug search values
  console.log("Context search values:", { searchText, selectedApprover, selectedDepartment, selectedBranch });
  
  // Get team attendance data for map display with date and search filtering
  // إنشاء كائن المعلمات بدون search_text في البداية
  const searchParams: any = {
    // Format dates to YYYY-MM-DD string format for API
    start_date: startDate ? startDate.toISOString().split('T')[0] : undefined,
    end_date: endDate ? endDate.toISOString().split('T')[0] : undefined,
    // Search filters - don't send 'all' values to API
    approver: selectedApprover && selectedApprover !== 'all' ? selectedApprover : undefined,
    department: selectedDepartment && selectedDepartment !== 'all' ? selectedDepartment : undefined,
    branch: selectedBranch && selectedBranch !== 'all' ? selectedBranch : undefined
  };
  
  // إضافة search_text بشكل منفصل للتأكد من أنه يضاف حتى لو كان فارغًا
  if (searchText !== undefined) {
    searchParams.search_text = searchText;
    console.log("Adding search_text to params explicitly:", searchText);
  }
  
  console.log("Search params for API:", searchParams);
  
  const {
    teamAttendance,
    isLoading: teamAttendanceLoading,
    error: teamAttendanceError,
    refetch: refetchTeamAttendance
  } = useTeamAttendance(searchParams);

  // Get attendance summary data for statistics cards with date filtering
  const {
    attendanceSummary,
    attendanceSummaryLoading,
    attendanceSummaryError,
    refetchAttendanceSummary
  } = useAttendanceSummary({
    // Format dates to YYYY-MM-DD string format for API
    start_date: startDate ? startDate.toISOString().split('T')[0] : undefined,
    end_date: endDate ? endDate.toISOString().split('T')[0] : undefined
  });
  
  // Get branches data from API
  const {
    data:branches,
    isLoading: branchesLoading,
    error: branchesError,
    refetch: refetchBranches
  } = useManagementHierarchies();

  const {
    data:managements,
    isLoading: managementsLoading,
    error: managementsError,
    refetch: refetchManagements
  } = useManagements();

  console.log('teamAttendancebranches',branches)
  
  // Employee details dialog state
  const [isEmployeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  
  // Selected employee data
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetails | null>(null);

  // Attendance status dialog state
  const [isAttendanceStatusDialogOpen, setAttendanceStatusDialogOpen] = useState(false);
  
  // Selected attendance record data
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState<AttendanceStatusRecord | null>(null);

  // Approver dialog state
  const [isApproverDialogOpen, setApproverDialogOpen] = useState(false);
  
  // Selected approver record data
  const [selectedApproverRecord, setSelectedApproverRecord] = useState<AttendanceStatusRecord | null>(null);

  // Toggle view function
  const toggleView = useCallback((view: "table" | "map") => setView(view), []);
  
  // Function to open the employee dialog
  const openEmployeeDialog = useCallback((employee: EmployeeDetails) => {
    setSelectedEmployee(employee);
    setEmployeeDialogOpen(true);
  }, []);
  
  // Function to close the employee dialog
  const closeEmployeeDialog = useCallback(() => {
    setEmployeeDialogOpen(false);
    setTimeout(() => setSelectedEmployee(null), 300); // Clear employee data after dialog closes
  }, []);
  
  // Function to open the attendance status dialog
  const openAttendanceStatusDialog = useCallback((record: AttendanceStatusRecord) => {
    setSelectedAttendanceRecord(record);
    setAttendanceStatusDialogOpen(true);
  }, []);
  
  // Function to close the attendance status dialog
  const closeAttendanceStatusDialog = useCallback(() => {
    setAttendanceStatusDialogOpen(false);
    setTimeout(() => setSelectedAttendanceRecord(null), 300); // Clear record data after dialog closes
  }, []);
  
  // Function to open the approver dialog
  const openApproverDialog = useCallback((record: AttendanceStatusRecord) => {
    setSelectedApproverRecord(record);
    setApproverDialogOpen(true);
  }, []);
  
  // Function to close the approver dialog
  const closeApproverDialog = useCallback(() => {
    setApproverDialogOpen(false);
    setTimeout(() => setSelectedApproverRecord(null), 300); // Clear record data after dialog closes
  }, []);

  // The value that will be provided to consumers
  const value: AttendanceContextType = {
    view,
    toggleView: (newView: "table" | "map") => setView(newView),
    
    // Team attendance data
    teamAttendance,
    teamAttendanceLoading,
    teamAttendanceError,
    refetchTeamAttendance,
    
    // Attendance summary data
    attendanceSummary,
    attendanceSummaryLoading,
    attendanceSummaryError,
    refetchAttendanceSummary,
    
    // Branches data from API
    branches,
    branchesLoading,
    branchesError,
    refetchBranches,
    
    // Management data from API
    managements,
    managementsLoading,
    managementsError,
    refetchManagements,
    
    // Date range for filtering
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    
    // Search filter state
    searchText,
    setSearchText: updateSearchText,
    selectedApprover,
    setSelectedApprover: updateSelectedApprover,
    selectedDepartment,
    setSelectedDepartment: updateSelectedDepartment,
    selectedBranch,
    setSelectedBranch: updateSelectedBranch,
    
    // Employee dialog state
    isEmployeeDialogOpen,
    setEmployeeDialogOpen,
    
    // Selected employee
    selectedEmployee,
    setSelectedEmployee,
    
    // Attendance status dialog
    isAttendanceStatusDialogOpen,
    setAttendanceStatusDialogOpen,
    
    // Selected attendance record
    selectedAttendanceRecord,
    setSelectedAttendanceRecord,
    
    // Approver dialog
    isApproverDialogOpen,
    setApproverDialogOpen,
    
    // Selected approver record
    selectedApproverRecord,
    setSelectedApproverRecord,
    
    // Functions
    openEmployeeDialog,
    closeEmployeeDialog,
    openAttendanceStatusDialog,
    closeAttendanceStatusDialog,
    openApproverDialog,
    closeApproverDialog
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

// Custom hook for using the context
export const useAttendance = (): AttendanceContextType => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
