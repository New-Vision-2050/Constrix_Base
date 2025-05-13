"use client";

import { OrgChartNode } from "@/types/organization";
// import packages
import { createContext, useCallback, useContext, useState } from "react";
import { useOrgStructureCxt } from "../../context/OrgStructureCxt";

// declare context types
type CxtType = {
  isUserCompanyOwner: boolean;
  companyOwnerId: string | undefined;
  branch: OrgChartNode | undefined;
  handleStoreBranch: (branch: OrgChartNode) => void;
};

export const ManagementsStructureCxt = createContext<CxtType>({} as CxtType);

// ** create a custom hook to use the context
export const useManagementsStructureCxt = () => {
  const context = useContext(ManagementsStructureCxt);
  if (!context) {
    throw new Error(
      "useManagementsStructureCxt must be used within a ManagementsStructureCxtProvider"
    );
  }
  return context;
};

export const ManagementsStructureCxtProvider = (
  props: React.PropsWithChildren
) => {
  // ** declare and define component state and variables
  const { children } = props;
  const { companyOwnerId, user } = useOrgStructureCxt();
  const isUserCompanyOwner = user?.id !== companyOwnerId;
  const [branch, setBranch] = useState<OrgChartNode>();

  // ** handle side effects

  // ** declare and define component helper methods
  const handleStoreBranch = useCallback(
    (branch: OrgChartNode) => setBranch(branch),
    []
  );

  // ** return component ui
  return (
    <ManagementsStructureCxt.Provider
      value={{ branch, companyOwnerId, isUserCompanyOwner, handleStoreBranch }}
    >
      {children}
    </ManagementsStructureCxt.Provider>
  );
};
