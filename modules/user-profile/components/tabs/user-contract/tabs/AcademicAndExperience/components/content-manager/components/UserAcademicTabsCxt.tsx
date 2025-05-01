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
import { Experience } from "@/modules/user-profile/types/experience";
import useUserCoursesData from "../../../hooks/useUserCoursesData";
import { Course } from "@/modules/user-profile/types/Course";
import useUserCertificationsData from "../../../hooks/useUserCertifications";
import { Certification } from "@/modules/user-profile/types/Certification";
import useUserCVData from "../../../hooks/useUserCVData";
import { UserCVFilesT } from "../../../api/get-user-cv";

// declare context types
type UserAcademicTabsCxtType = {
  // user qualifications
  userQualificationsLoading: boolean;
  userQualifications: Qualification[] | undefined;
  handleRefreshUserQualifications: () => void;
  // user brief information
  userBrief: BriefInfoT | undefined;
  handleRefetchUserBrief: () => void;
  // user experiences
  userExperiencesLoading: boolean;
  userExperiences: Experience[] | undefined;
  handleRefetchUserExperiences: () => void;
  // user courses
  userCoursesLoading: boolean;
  userCourses: Course[] | undefined;
  handleRefetchUserCourses: () => void;
  // user certifications
  userCertificationsLoading: boolean;
  userCertifications: Certification[] | undefined;
  handleRefetchUserCertifications: () => void;
  // user cv
  userCV: UserCVFilesT | undefined;
  handleRefetchUserCV: () => void;
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
  const {
    data: userQualifications,
    isLoading: userQualificationsLoading,
    refetch: refreshUserQualifications,
  } = useUserQualifications(user?.user_id ?? "");

  // user brief
  const { data: userBrief, refetch: refetchUserBrief } = useUserBriefData(
    user?.user_id ?? ""
  );

  // user experiences
  const {
    data: userExperiences,
    isLoading: userExperiencesLoading,
    refetch: refetchUserExperiences,
  } = useUserExperiences(user?.user_id ?? "");

  // user courses
  const {
    data: userCourses,
    isLoading: userCoursesLoading,
    refetch: refetchUserCourses,
  } = useUserCoursesData(user?.user_id ?? "");

  // user certifications
  const {
    data: userCertifications,
    isLoading: userCertificationsLoading,
    refetch: refetchUserCertifications,
  } = useUserCertificationsData(user?.user_id ?? "");

  // user cv
  const { data: userCV, refetch: refetchUserCV } = useUserCVData(
    user?.user_id ?? ""
  );

  // ** handle side effects

  // ** declare and define component helper methods
  const handleRefetchUserCV = () => {
    refetchUserCV();
  };

  const handleRefetchUserCertifications = () => {
    refetchUserCertifications();
  };

  const handleRefetchUserExperiences = () => {
    refetchUserExperiences();
  };

  const handleRefetchUserCourses = () => {
    refetchUserCourses();
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
        userQualificationsLoading,
        handleRefreshUserQualifications,
        // user brief information
        userBrief,
        handleRefetchUserBrief,
        // user experiences
        userExperiences,
        userExperiencesLoading,
        handleRefetchUserExperiences,
        // user courses
        userCourses,
        userCoursesLoading,
        handleRefetchUserCourses,
        // user certifications
        userCertifications,
        userCertificationsLoading,
        handleRefetchUserCertifications,
        // user cv
        userCV,
        handleRefetchUserCV,
      }}
    >
      {children}
    </UserAcademicTabsCxt.Provider>
  );
};
