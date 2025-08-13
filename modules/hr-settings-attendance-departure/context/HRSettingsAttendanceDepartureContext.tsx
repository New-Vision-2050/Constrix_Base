"use client";

import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";

// Define available tabs
type HRSettingsAttendanceDepartureTabType = "attendance-departure-setting-tab";

// Define context type
interface HRSettingsAttendanceDepartureContextType {
  // Active tab state
  activeTab: HRSettingsAttendanceDepartureTabType;
  setActiveTab: (tab: HRSettingsAttendanceDepartureTabType) => void;
}

// Create the context
const HRSettingsAttendanceDepartureContext = createContext<
  HRSettingsAttendanceDepartureContextType | undefined
>(undefined);

// Provider component
export const HRSettingsAttendanceDepartureProvider: React.FC<
  PropsWithChildren
> = ({ children }) => {
  // Tab state
  const [activeTab, setActiveTab] =
    useState<HRSettingsAttendanceDepartureTabType>(
      "attendance-departure-setting-tab"
    );
    
  return (
    <HRSettingsAttendanceDepartureContext.Provider
      value={{
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </HRSettingsAttendanceDepartureContext.Provider>
  );
};

// Custom hook to use the context
export const useHRSettingsAttendanceDeparture = () => {
  const context = useContext(HRSettingsAttendanceDepartureContext);
  if (context === undefined) {
    throw new Error(
      "useHRSettingsAttendanceDeparture must be used within a HRSettingsAttendanceDepartureProvider"
    );
  }
  return context;
};
