"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define available tabs
type HRSettingsTabType = "employee-positions" | "departments" | "branches" | "job-titles";

// Define context type
interface HRSettingsContextType {
  // Active tab state
  activeTab: HRSettingsTabType;
  setActiveTab: (tab: HRSettingsTabType) => void;
}

// Create the context
const HRSettingsContext = createContext<HRSettingsContextType | undefined>(undefined);

// Provider component
interface HRSettingsProviderProps {
  children: ReactNode;
}

export const HRSettingsProvider: React.FC<HRSettingsProviderProps> = ({ children }) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<HRSettingsTabType>("employee-positions");

  return (
    <HRSettingsContext.Provider
      value={{
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </HRSettingsContext.Provider>
  );
};

// Custom hook to use the context
export const useHRSettings = () => {
  const context = useContext(HRSettingsContext);
  if (context === undefined) {
    throw new Error("useHRSettings must be used within a HRSettingsProvider");
  }
  return context;
};
