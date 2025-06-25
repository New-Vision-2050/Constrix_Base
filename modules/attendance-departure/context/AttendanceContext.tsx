"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { EmployeeDetails } from "../components/map/EmployeeDetails";

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
  
  // Functions to open and close the dialog
  openEmployeeDialog: (employee: EmployeeDetails) => void;
  closeEmployeeDialog: () => void;
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
