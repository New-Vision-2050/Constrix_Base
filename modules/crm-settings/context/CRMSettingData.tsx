"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useCRMSharedSetting } from "../hooks/useCRMSharedSetting";
import { CRMSettingsT } from "../api/get-shared-settings";

// Define context type
interface CxtType {
  sharedSettings: CRMSettingsT | undefined;
  sharedSettingsLoading: boolean;
  refetchSharedSettings: () => void;
}

// Create the context
const Cxt = createContext<CxtType | undefined>(undefined);

// Provider component
interface PropsT {
  children: ReactNode;
}

export const CRMSettingDataCxtProvider: React.FC<PropsT> = ({ children }) => {
  // ** declare and define helper variables
  const { data: sharedSettings, isLoading: sharedSettingsLoading, refetch: refetchSharedSettings } =
    useCRMSharedSetting();

  // ** return provider
  return (
    <Cxt.Provider value={{ sharedSettings, sharedSettingsLoading, refetchSharedSettings }}>
      {children}
    </Cxt.Provider>
  );
};
    
// Custom hook to use the context
export const useCRMSettingDataCxt = () => {
  const context = useContext(Cxt);
  if (context === undefined) {
    throw new Error(
      "useCRMSettingDataCxt must be used within a CRMSettingDataCxtProvider"
    );
  }
  return context;
};
