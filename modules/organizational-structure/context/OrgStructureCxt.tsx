"use client";

// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useMemo } from "react";
import useOrgWidgetsData from "../hooks/useOrgWidgetsData";
import { OrgWidgetsResponse } from "../api/fetch-org-stucture-widget";
import useOrgBranchiesData from "../hooks/useOrgBranchies";
import { SelectOption } from "@/types/select-option";
import useCurrentAuthCompany from "@/hooks/use-auth-company";
import useUserData from "@/hooks/use-user-data";
import { CurrentUser } from "@/types/current-user";

// declare context types
type OrgStructureCxtType = {
  widgetsLoading: boolean;
  user: CurrentUser | undefined;
  companyOwnerId: string | undefined;
  widgets: OrgWidgetsResponse | undefined;
  branchiesList: SelectOption[] | undefined;
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
  const { data: branchiesList } = useOrgBranchiesData();
  const { data: userData } = useUserData();
  const { data: companyData } = useCurrentAuthCompany();
  const user = useMemo(() => {
    return userData?.payload;
  }, [userData]);
  const companyOwnerId = useMemo(() => {
    return companyData?.payload?.owner_id;
  }, [companyData]);

  // ** return component ui
  return (
    <OrgStructureCxt.Provider
      value={{ user, widgets, widgetsLoading, branchiesList, companyOwnerId }}
    >
      {children}
    </OrgStructureCxt.Provider>
  );
};
