"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
// types
import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";

// declare context types
type VerticalListCxtType = {
  activeSection: UserProfileNestedTab | undefined;
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const VerticalListCxt = createContext<VerticalListCxtType>(
  {} as VerticalListCxtType
);

// ** create a custom hook to use the context
export const useVerticalListCxt = () => {
  const context = useContext(VerticalListCxt);
  if (!context) {
    throw new Error(
      "useVerticalListCxt must be used within a VerticalListCxtProvider"
    );
  }
  return context;
};

type PropsT = {
  children: ReactNode;
  defaultSection: UserProfileNestedTab;
};
export const VerticalListCxtProvider = ({
  defaultSection,
  children,
}: PropsT) => {
  // ** declare and define component state and variables
  const [activeSection, setActiveSection] =
    useState<UserProfileNestedTab>(defaultSection);

  // ** handle side effects

  // ** declare and define component helper methods
  const handleChangeActiveSection = (section: UserProfileNestedTab) =>
    setActiveSection(section);

  // ** return component ui
  return (
    <VerticalListCxt.Provider
      value={{
        activeSection,
        handleChangeActiveSection,
      }}
    >
      {children}
    </VerticalListCxt.Provider>
  );
};
