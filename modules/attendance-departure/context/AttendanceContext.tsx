"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { EmployeeDetails } from "../types/employee";
import { AttendanceStatusRecord } from "../types/attendance";

// Define the type of data in the context
interface AttendanceContextType {
  // Display state: table or map
  view: "table" | "map";
  // toggle view function
  toggleView: (view: "table" | "map") => void;

  // Search date
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  
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

  // Search date
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
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
    toggleView,
    selectedDate,
    setSelectedDate,
    isEmployeeDialogOpen,
    setEmployeeDialogOpen,
    selectedEmployee,
    setSelectedEmployee,
    openEmployeeDialog,
    closeEmployeeDialog,
    isAttendanceStatusDialogOpen,
    setAttendanceStatusDialogOpen,
    selectedAttendanceRecord,
    setSelectedAttendanceRecord,
    openAttendanceStatusDialog,
    closeAttendanceStatusDialog,
    isApproverDialogOpen,
    setApproverDialogOpen,
    selectedApproverRecord,
    setSelectedApproverRecord,
    openApproverDialog,
    closeApproverDialog,
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
