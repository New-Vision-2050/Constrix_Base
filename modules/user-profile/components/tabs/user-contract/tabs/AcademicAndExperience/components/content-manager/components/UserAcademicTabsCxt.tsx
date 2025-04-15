"use client";

import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext } from "react";
import useUserQualifications from "../../../hooks/useUserQualifications";
import { Qualification } from "@/modules/user-profile/types/qualification";
import useUserBriefData from "../../../hooks/useUserBriefData";
import { BriefInfoT } from "../../../api/get-user-brief";
import useUserExperiences from "../../../hooks/useUserExperiences";

// declare context types
type UserAcademicTabsCxtType = {
  // user qualifications
  userQualifications: Qualification[] | undefined;
  handleRefreshUserQualifications: () => void;
  // user brief information
  userBrief: BriefInfoT | undefined;
  handleRefetchUserBrief: () => void;
  // user experiences
  handleRefetchUserExperiences: () => void;
};

export const UserAcademicTabsCxt = createContext<UserAcademicTabsCxtType>(
  {} as UserAcademicTabsCxtType
);

// ** create a custom hook to use the context
export const useUserAcademicTabsCxt = () => {
  const context = useContext(UserAcademicTabsCxt);
  if (!context) {
    throw new Error(
      "useUserAcademicTabsCxt must be used within a UserAcademicTabsCxtProvider"
    );
  }
  return context;
};

export const UserAcademicTabsCxtProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const { user } = useUserProfileCxt();
  // user qualifications
  const { data: userQualifications, refetch: refreshUserQualifications } =
    useUserQualifications(user?.user_id ?? "");

  // user brief
  const { data: userBrief, refetch: refetchUserBrief } = useUserBriefData(
    user?.user_id ?? ""
  );

  // user experiences
  const { data: userExperiences, refetch: refetchUserExperiences } =
    useUserExperiences(user?.user_id ?? "");

  console.log("userExperiences", userExperiences);
  // ** handle side effects

  // ** declare and define component helper methods
  const handleRefetchUserExperiences = () => {
    refetchUserExperiences();
  };

  const handleRefreshUserQualifications = () => {
    refreshUserQualifications();
  };

  const handleRefetchUserBrief = () => {
    refetchUserBrief();
  };

  // ** return component ui
  return (
    <UserAcademicTabsCxt.Provider
      value={{
        // user qualifications
        userQualifications,
        handleRefreshUserQualifications,
        // user brief information
        userBrief,
        handleRefetchUserBrief,
        // user experiences
        handleRefetchUserExperiences,
      }}
    >
      {children}
    </UserAcademicTabsCxt.Provider>
  );
};
