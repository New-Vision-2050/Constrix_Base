"use client";

import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useState } from "react";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { financialDataSections } from "../constants/financial-data-sections";
import useUserSalaryData from "../hooks/useUserSalaryData";
import { Salary } from "@/modules/user-profile/types/Salary";
import usePrivilegesData from "../hooks/usePrivilegesData";
import {
  Privilege,
  UserPrivilege,
} from "@/modules/user-profile/types/privilege";
import usePrivileges from "../hooks/usePrivileges";

// declare context types
type FinancialDataCxtType = {
  activeSection: UserProfileNestedTab | undefined;
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
  // user salary
  userSalaryLoading: boolean;
  userSalary: Salary | undefined;
  handleRefreshSalaryData: () => void;
  // privileges data
  privileges: Privilege[] | undefined;
  handleRefreshPrivileges: () => void;
  // added privileges
  addedPrivilegesListLoading: boolean;
  addedPrivilegesList: UserPrivilege[] | undefined;
  handleRefreshPrivilegesList: () => void;
};

export const FinancialDataCxt = createContext<FinancialDataCxtType>(
  {} as FinancialDataCxtType
);

// ** create a custom hook to use the context
export const useFinancialDataCxt = () => {
  const context = useContext(FinancialDataCxt);
  if (!context) {
    throw new Error(
      "useFinancialDataCxt must be used within a FinancialDataCxtProvider"
    );
  }
  return context;
};

export const FinancialDataCxtProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const { user } = useUserProfileCxt();
  const [activeSection, setActiveSection] = useState<UserProfileNestedTab>(
    financialDataSections[0]
  );

  // user salary data
  const {
    data: userSalary,
    isLoading: userSalaryLoading,
    refetch: refetchSalaryData,
  } = useUserSalaryData(user?.user_id ?? "");

  // privileges data
  const { data: privileges, refetch: refreshPrivileges } = usePrivilegesData();

  // privileges list
  const {
    data: addedPrivilegesList,
    isLoading: addedPrivilegesListLoading,
    refetch: refreshPrivilegesList,
  } = usePrivileges(user?.user_id ?? "");

  // ** declare and define component helper methods
  const handleRefreshPrivilegesList = () => {
    refreshPrivilegesList();
  };

  const handleRefreshPrivileges = () => {
    refreshPrivileges();
  };

  const handleChangeActiveSection = (section: UserProfileNestedTab) =>
    setActiveSection(section);

  const handleRefreshSalaryData = () => {
    refetchSalaryData();
  };

  // ** return component ui
  return (
    <FinancialDataCxt.Provider
      value={{
        activeSection,
        handleChangeActiveSection,
        // user salary
        userSalary,
        userSalaryLoading,
        handleRefreshSalaryData,
        // privileges data
        privileges,
        handleRefreshPrivileges,
        // added privileges
        addedPrivilegesList,
        handleRefreshPrivilegesList,
        addedPrivilegesListLoading,
      }}
    >
      {children}
    </FinancialDataCxt.Provider>
  );
};
