"use client";

import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useState } from "react";
import { userStatusDataSections } from "../UserStatusDataSections";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

// declare context types
type UserStatusCxtType = {
  activeSection: UserProfileNestedTab | undefined;
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const UserStatusCxt = createContext<UserStatusCxtType>(
  {} as UserStatusCxtType
);

// ** create a custom hook to use the context
export const useUserStatusCxt = () => {
  const context = useContext(UserStatusCxt);
  if (!context) {
    throw new Error(
      "useUserStatusCxt must be used within a UserStatusCxtProvider"
    );
  }
  return context;
};

export const UserStatusCxtProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const { verticalSection } = useUserProfileCxt();
  const defaultSection =
    verticalSection === null
      ? userStatusDataSections[0]
      : userStatusDataSections?.filter(
          (ele) => ele.id === verticalSection
        )?.[0];

  const [activeSection, setActiveSection] =
    useState<UserProfileNestedTab>(defaultSection);

  console.log(
    "verticalSection",
    verticalSection,
    defaultSection,
    activeSection
  );
  // ** declare and define component helper methods
  const handleChangeActiveSection = (section: UserProfileNestedTab) =>
    setActiveSection(section);

  // ** return component ui
  return (
    <UserStatusCxt.Provider
      value={{
        activeSection,
        handleChangeActiveSection,
      }}
    >
      {children}
    </UserStatusCxt.Provider>
  );
};
