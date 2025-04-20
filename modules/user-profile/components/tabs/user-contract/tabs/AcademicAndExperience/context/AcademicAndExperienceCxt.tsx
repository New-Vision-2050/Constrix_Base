"use client";

import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useState } from "react";
import { AcademicAndExperienceSidebarItems } from "../constants/AcademicAndExperienceSidebarItems";

// declare context types
type AcademicAndExperienceCxtType = {
  activeSection: UserProfileNestedTab | undefined;
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const AcademicAndExperienceCxt =
  createContext<AcademicAndExperienceCxtType>(
    {} as AcademicAndExperienceCxtType
  );

// ** create a custom hook to use the context
export const useAcademicAndExperienceCxt = () => {
  const context = useContext(AcademicAndExperienceCxt);
  if (!context) {
    throw new Error(
      "useAcademicAndExperienceCxt must be used within a AcademicAndExperienceCxtProvider"
    );
  }
  return context;
};

export const AcademicAndExperienceCxtProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const [activeSection, setActiveSection] = useState<UserProfileNestedTab>(
    AcademicAndExperienceSidebarItems[0]
  );

  // ** handle side effects

  // ** declare and define component helper methods
  const handleChangeActiveSection = (section: UserProfileNestedTab) =>
    setActiveSection(section);

  // ** return component ui
  return (
    <AcademicAndExperienceCxt.Provider
      value={{ activeSection, handleChangeActiveSection }}
    >
      {children}
    </AcademicAndExperienceCxt.Provider>
  );
};
