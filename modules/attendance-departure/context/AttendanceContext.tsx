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
import { AttendanceStatusRecord, AttendanceHistoryRecord, AttendanceHistoryPayload } from "../types/attendance";
import { useTeamAttendance } from "../hooks/useTeamAttendance";
import { useAttendanceSummary } from "../hooks/useAttendanceSummary";
import { AttendanceSummaryData } from "../api/attendanceSummary";
import { useManagements } from "../hooks/useManagements";
import { useConstraints } from "../hooks/useConstraints";
import { Constraint } from "../api/getConstraints";
import { ManagementHierarchyItem } from "../api/getHierarchies";
import { useBranchesHierarchies } from "../hooks/useBranchesHierarchies";
import { useAttendanceHistory } from "../hooks/useAttendanceHistory";
import { useMapTrackingData } from "../hooks/useMapTrackingData";
import { MapEmployee } from "../components/map/types";
import { useConstraintDetails } from "../hooks/useConstraintDetails";
import { ConstraintDetails } from "../types/constraint";

// Define the type of data in the context
interface AttendanceContextType {
  // Display state: table or map
  view: "table" | "map";
  // toggle view function
  toggleView: (view: "table" | "map") => void;

  // current record
  currentRecord: AttendanceStatusRecord | null;
  
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

  // Constraints (approvers) data from API
  constraints: Constraint[]|undefined;
  constraintsLoading: boolean;
  constraintsError: Error | null;
  refetchConstraints: () => void;
  
  // Employee details dialog state
  isEmployeeDialogOpen: boolean;
  setEmployeeDialogOpen: (isOpen: boolean) => void;
  
  // Selected employee data
  selectedEmployee: EmployeeDetails | null;
  setSelectedEmployee: (employee: EmployeeDetails | null) => void;
  
  // Attendance status dialog state
  isAttendanceStatusDialogOpen: boolean;
  setAttendanceStatusDialogOpen: (isOpen: boolean) => void;
  
  // Approver dialog state
  isApproverDialogOpen: boolean;
  setApproverDialogOpen: (isOpen: boolean) => void;
    
  // Attendance history data - original payload structure with time range keys
  attendanceHistoryPayload: AttendanceHistoryPayload[];
  // Attendance history data - flattened array for backward compatibility
  attendanceHistory: AttendanceHistoryRecord[];
  attendanceHistoryLoading: boolean;
  attendanceHistoryError: Error | null;
  fetchAttendanceHistory: (id: string, startDate: string, endDate: string) => Promise<void>;
  refetchAttendanceHistory: () => void;
  
  // Functions to open and close the employee dialog
  openEmployeeDialog: (employee: EmployeeDetails) => void;
  closeEmployeeDialog: () => void;
  
  // Functions to open and close the attendance status dialog
  openAttendanceStatusDialog: (record: AttendanceStatusRecord) => void;
  closeAttendanceStatusDialog: () => void;
  
  // Functions to open and close the approver dialog
  openApproverDialog: (record: AttendanceStatusRecord) => void;
  closeApproverDialog: () => void;

  // Map tracking data
  mapTrackingData: MapEmployee[];
  mapTrackingDataLoading: boolean;
  mapTrackingDataError: Error | null;
  refetchMapTrackingData: () => void;
  
  // Constraint details data
  constraintDetails: ConstraintDetails | null;
  constraintDetailsLoading: boolean;
  constraintDetailsError: Error | null;
  fetchConstraintDetails: (id: string) => void;
  refetchConstraintDetails: () => void;
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
    setSearchText(text);
  }, []);
  
  const updateSelectedApprover = useCallback((value: string) => {
    setSelectedApprover(value);
  }, []);
  
  const updateSelectedDepartment = useCallback((value: string) => {
    setSelectedDepartment(value);
  }, []);
  
  const updateSelectedBranch = useCallback((value: string) => {
    setSelectedBranch(value);
  }, []);
  
  // Get team attendance data for map display with date and search filtering
  // Create parameters object without search_text initially
  const searchParams: any = {
    // Format dates to YYYY-MM-DD string format for API
    start_date: startDate ? startDate.toISOString().split('T')[0] : undefined,
    end_date: endDate ? endDate.toISOString().split('T')[0] : undefined,
    // Search filters - don't send 'all' values to API
    approver: selectedApprover && selectedApprover !== 'all' ? selectedApprover : undefined,
    department: selectedDepartment && selectedDepartment !== 'all' ? selectedDepartment : undefined,
    branch: selectedBranch && selectedBranch !== 'all' ? selectedBranch : undefined
  };
  
  // Add search_text separately to ensure it's added even if empty
  if (searchText !== undefined) {
    searchParams.search_text = searchText;
  }
  
  const {
    teamAttendance,
    isLoading: teamAttendanceLoading,
    error: teamAttendanceError,
    refetch: refetchTeamAttendance
  } = useTeamAttendance(searchParams);


  // Get team attendance data for map display with date and search filtering
  const {
    teamAttendance: mapTrackingData,
    isLoading: mapTrackingDataLoading,
    error: mapTrackingDataError,
    refetch: refetchMapTrackingData
  } = useMapTrackingData(searchParams);


  

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
  } = useBranchesHierarchies();

  const {
    data:managements,
    isLoading: managementsLoading,
    error: managementsError,
    refetch: refetchManagements
  } = useManagements();

  // Get constraints (approvers) data from API
  const {
    data: constraints,
    isLoading: constraintsLoading,
    error: constraintsError,
    refetch: refetchConstraints
  } = useConstraints();

  // Attendance history hook
  const {
    attendanceHistoryPayload,
    attendanceHistory,
    setAttendanceHistory,
    setAttendanceHistoryPayload,
    loading: attendanceHistoryLoading,
    error: attendanceHistoryError,
    fetchAttendanceHistory,
    refetch: refetchAttendanceHistory
  } = useAttendanceHistory();

  // Constraint details state and hook
  const {
    constraintDetails,
    loading: constraintDetailsLoading,
    error: constraintDetailsError,
    fetchConstraintDetails,
    refetch: refetchConstraintDetails,
    setConstraintDetails
  } = useConstraintDetails();

  // Employee details dialog state
  const [isEmployeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  
  // Selected employee data
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetails | null>(null);

  // Attendance status dialog state
  const [isAttendanceStatusDialogOpen, setAttendanceStatusDialogOpen] = useState(false);
  
  // Approver dialog state
  const [isApproverDialogOpen, setApproverDialogOpen] = useState(false);
  
  // Toggle view function
  const toggleView = useCallback((view: "table" | "map") => setView(view), []);
  
  // current record
  const [currentRecord, setCurrentRecord] = useState<AttendanceStatusRecord | null>(null);
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
    fetchConstraintDetails(record.id);
    setAttendanceStatusDialogOpen(true);
  }, []);
  
  // Function to close the attendance status dialog
  const closeAttendanceStatusDialog = useCallback(() => {
    setAttendanceStatusDialogOpen(false);
    setTimeout(() => setConstraintDetails(null), 300); // Clear record data after dialog closes
  }, []);
  
  // Function to open the approver dialog
  const openApproverDialog = useCallback((record: AttendanceStatusRecord) => {
    fetchAttendanceHistory(record.user.id, record.work_date, record.work_date);
    setCurrentRecord(record);
    setApproverDialogOpen(true);
  }, []);
  
  // Function to close the approver dialog
  const closeApproverDialog = useCallback(() => {
    setApproverDialogOpen(false);
    setCurrentRecord(null);
    setTimeout(() => setAttendanceHistory([]), 300); // Clear record data after dialog closes
  }, []);

  // The value that will be provided to consumers
  const value: AttendanceContextType = {
    view,
    toggleView: (newView: "table" | "map") => setView(newView),
    
    // current record
    currentRecord,
    
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
    
    // Constraints (approvers) data from API
    constraints,
    constraintsLoading,
    constraintsError,
    refetchConstraints,
    
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
    
    // Approver dialog
    isApproverDialogOpen,
    setApproverDialogOpen,
    
    // Attendance history data - original payload structure
    attendanceHistoryPayload,
    // Attendance history data - flattened array
    attendanceHistory,
    attendanceHistoryLoading,
    attendanceHistoryError,
    fetchAttendanceHistory,
    refetchAttendanceHistory,
    
    // Constraint details data
    constraintDetails,
    constraintDetailsLoading,
    constraintDetailsError,
    fetchConstraintDetails,
    refetchConstraintDetails,

    // Functions
    openEmployeeDialog,
    closeEmployeeDialog,
    openAttendanceStatusDialog,
    closeAttendanceStatusDialog,
    openApproverDialog,
    closeApproverDialog,

    // Map tracking data
    mapTrackingData,
    mapTrackingDataLoading,
    mapTrackingDataError,
    refetchMapTrackingData
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
