"use client";

import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useState } from "react";

// declare context types
type PersonalDataTabCxtType = {
  activeSection: UserProfileNestedTab | undefined;
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
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
  const [activeSection, setActiveSection] = useState<UserProfileNestedTab>();

  // ** handle side effects

  // ** declare and define component helper methods
  const handleChangeActiveSection = (section: UserProfileNestedTab) =>
    setActiveSection(section);

  // ** return component ui
  return (
    <PersonalDataTabCxt.Provider
      value={{ activeSection, handleChangeActiveSection }}
    >
      {children}
    </PersonalDataTabCxt.Provider>
  );
};
