"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

// Define the type of data in the context
interface AttendanceContextType {
  // Display state: table or map
  view: "table" | "map";
  // toggle view function
  toggleView: (view: "table" | "map") => void;

  // Search date
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
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

  // You can add more states and functions here
  const toggleView = useCallback((view: "table" | "map") => setView(view), []);

  // The value that will be provided to consumers
  const value: AttendanceContextType = {
    view,
    toggleView,
    selectedDate,
    setSelectedDate,
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
