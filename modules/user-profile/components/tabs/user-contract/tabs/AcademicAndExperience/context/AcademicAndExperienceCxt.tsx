"use client";

import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useState, useEffect } from "react";
import { AcademicAndExperienceSidebarItems } from "../constants/AcademicAndExperienceSidebarItems";
import { useTranslations } from "next-intl";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

// declare context types
type AcademicAndExperienceCxtType = {
  activeSection: UserProfileNestedTab | undefined;
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const AcademicAndExperienceCxt =
  createContext<AcademicAndExperienceCxtType>(
    {} as AcademicAndExperienceCxtType,
  );

// ** create a custom hook to use the context
export const useAcademicAndExperienceCxt = () => {
  const context = useContext(AcademicAndExperienceCxt);
  if (!context) {
    throw new Error(
      "useAcademicAndExperienceCxt must be used within a AcademicAndExperienceCxtProvider",
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
  const t = useTranslations(
    "UserProfile.tabs.verticalLists.academicAndExperienceList",
  );
  const { verticalSection, setVerticalSection } = useUserProfileCxt();
  const sections = AcademicAndExperienceSidebarItems(t);
  const [activeSection, setActiveSection] = useState<UserProfileNestedTab>();

  // ** handle side effects
  useEffect(() => {
    if (verticalSection) {
      const section = sections.find((s) => s.id === verticalSection);
      if (section) {
        setActiveSection(section);
      } else {
        setActiveSection(sections[0]);
      }
    } else {
      setActiveSection(sections[0]);
    }
  }, [verticalSection]);

  // ** declare and define component helper methods
  const handleChangeActiveSection = (section: UserProfileNestedTab) => {
    setActiveSection(section);
    setVerticalSection(section.id);
  };

  // ** return component ui
  return (
    <AcademicAndExperienceCxt.Provider
      value={{ activeSection, handleChangeActiveSection }}
    >
      {children}
    </AcademicAndExperienceCxt.Provider>
  );
};
