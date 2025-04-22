"use client";

import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useState } from "react";
import useUserPersonalData from "../hooks/useUserPersonalData";
import { PersonalUserDataSectionT } from "../api/get-personal-data";
import { UserConnectionInformationT } from "../api/get-user-connection-data";
import useUserConnectionData from "../hooks/useUserConnectionData";
import useUserIdentityData from "../hooks/useUserIdentityData";
import { UserIdentityInformationT } from "../api/get-identity-data";
import { PersonalDataSections } from "../constants/PersonalDataSections";
import { useTranslations } from "next-intl";

// declare context types
type PersonalDataTabCxtType = {
  activeSection: UserProfileNestedTab | undefined;
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;

  // user -personal data
  userPersonalData: PersonalUserDataSectionT | undefined;
  handleRefreshPersonalData: () => void;

  // user - connection data
  userConnectionData: UserConnectionInformationT | undefined;
  handleRefreshConnectionData: () => void;

  // user - identity data
  userIdentityData: UserIdentityInformationT | undefined;
  handleRefreshIdentityData: () => void;
};

export const PersonalDataTabCxt = createContext<PersonalDataTabCxtType>(
  {} as PersonalDataTabCxtType
);

// ** create a custom hook to use the context
export const usePersonalDataTabCxt = () => {
  const context = useContext(PersonalDataTabCxt);
  if (!context) {
    throw new Error(
      "usePersonalDataTabCxt must be used within a PersonalDataTabCxtProvider"
    );
  }
  return context;
};

export const PersonalDataTabCxtProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const t = useTranslations("UserProfile.tabs.verticalLists.personalList");
  const { data: userPersonalData, refetch: refreshPersonalData } =
    useUserPersonalData();
  const { data: userConnectionData, refetch: refreshConnectionData } =
    useUserConnectionData();
  const { data: userIdentityData, refetch: refetchIdentityData } =
    useUserIdentityData();
  const [activeSection, setActiveSection] = useState<UserProfileNestedTab>(
    PersonalDataSections(t)[0]
  );

  // ** handle side effects

  // ** declare and define component helper methods
  const handleRefreshIdentityData = () => {
    refetchIdentityData();
  };

  const handleRefreshPersonalData = () => {
    refreshPersonalData();
  };

  const handleRefreshConnectionData = () => {
    refreshConnectionData();
  };

  const handleChangeActiveSection = (section: UserProfileNestedTab) =>
    setActiveSection(section);

  // ** return component ui
  return (
    <PersonalDataTabCxt.Provider
      value={{
        activeSection,
        handleChangeActiveSection,
        // user -personal data
        userPersonalData,
        handleRefreshPersonalData,
        // user - connection data
        userConnectionData,
        handleRefreshConnectionData,
        // user - identity data
        userIdentityData,
        handleRefreshIdentityData,
      }}
    >
      {children}
    </PersonalDataTabCxt.Provider>
  );
};
