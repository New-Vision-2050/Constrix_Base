"use client";

import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useEffect, useState } from "react";
import useUserPersonalData from "../hooks/useUserPersonalData";
import { PersonalUserDataSectionT } from "../api/get-personal-data";
import { UserConnectionInformationT } from "../api/get-user-connection-data";
import useUserConnectionData from "../hooks/useUserConnectionData";
import useUserIdentityData from "../hooks/useUserIdentityData";
import { UserIdentityInformationT } from "../api/get-identity-data";
import { PersonalDataSections } from "../constants/PersonalDataSections";
import { useTranslations } from "next-intl";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { UserProfileData } from "@/modules/user-profile/types/user-profile-response";

// declare context types
type PersonalDataTabCxtType = {
  activeSection: UserProfileNestedTab | undefined;
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;

  // user -personal data
  userPersonalDataLoading: boolean;
  userPersonalData: PersonalUserDataSectionT | undefined;
  handleRefreshPersonalData: () => void;

  // user - connection data
  userConnectionDataLoading: boolean;
  userConnectionData: UserConnectionInformationT | undefined;
  handleRefreshConnectionData: () => void;

  // user - identity data
  userIdentityDataLoading: boolean;
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
  userId,
  companyId,
}: {
  userId: string;
  companyId: string;
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const t = useTranslations("UserProfile.tabs.verticalLists.personalList");

  const {
    data: userPersonalData,
    isLoading: userPersonalDataLoading,
    refetch: refreshPersonalData,
  } = useUserPersonalData(userId);
  const {
    data: userConnectionData,
    isLoading: userConnectionDataLoading,
    refetch: refreshConnectionData,
  } = useUserConnectionData(userId);
  const {
    data: userIdentityData,
    isLoading: userIdentityDataLoading,
    refetch: refetchIdentityData,
  } = useUserIdentityData(userId);
  const [activeSection, setActiveSection] = useState<UserProfileNestedTab>(
    PersonalDataSections(t)[0]
  );

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
        userPersonalDataLoading,
        handleRefreshPersonalData,
        // user - connection data
        userConnectionData,
        userConnectionDataLoading,
        handleRefreshConnectionData,
        // user - identity data
        userIdentityData,
        userIdentityDataLoading,
        handleRefreshIdentityData,
      }}
    >
      {children}
    </PersonalDataTabCxt.Provider>
  );
};
