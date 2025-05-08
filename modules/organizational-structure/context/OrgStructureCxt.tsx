"use client";

// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext } from "react";
import useOrgWidgetsData from "../hooks/useOrgWidgetsData";
import { OrgWidgetsResponse } from "../api/fetch-org-stucture-widget";

// declare context types
type OrgStructureCxtType = {
  widgetsLoading: boolean;
  widgets: OrgWidgetsResponse | undefined;
};

export const OrgStructureCxt = createContext<OrgStructureCxtType>(
  {} as OrgStructureCxtType
);

// ** create a custom hook to use the context
export const useOrgStructureCxt = () => {
  const context = useContext(OrgStructureCxt);
  if (!context) {
    throw new Error(
      "useOrgStructureCxt must be used within a OrgStructureCxtProvider"
    );
  }
  return context;
};

type PropsT = { children: ReactNode };

export const OrgStructureCxtProvider = ({ children }: PropsT) => {
  // ** declare and define component state and variables
  const { data: widgets, isLoading: widgetsLoading } = useOrgWidgetsData();

  // ** return component ui
  return (
    <OrgStructureCxt.Provider value={{ widgets, widgetsLoading }}>
      {children}
    </OrgStructureCxt.Provider>
  );
};
