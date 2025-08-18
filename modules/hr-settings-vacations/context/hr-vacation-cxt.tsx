"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define context type
interface HRVacationCxtType {}

// Create the context
const HRVacationCxt = createContext<HRVacationCxtType | undefined>(undefined);

// Provider component
interface HRVacationCxtProviderProps {
  children: ReactNode;
}

export const HRVacationCxtProvider: React.FC<HRVacationCxtProviderProps> = ({
  children,
}) => {
  return <HRVacationCxt.Provider value={{}}>{children}</HRVacationCxt.Provider>;
};

// Custom hook to use the context
export const useHRVacationCxt = () => {
  const context = useContext(HRVacationCxt);
  if (context === undefined) {
    throw new Error("useHRVacationCxt must be used within a HRVacationCxtProvider");
  }
  return context;
};
