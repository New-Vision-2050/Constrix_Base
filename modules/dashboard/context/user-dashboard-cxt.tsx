"use client";

// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext } from "react";
import useUserProfileData from "../hooks/useUserProfileData";
import { UserProfileData } from "../types/user-profile-response";
import useUserPersonalData from "@/modules/user-profile/components/tabs/user-contract/tabs/PersonalData/hooks/useUserPersonalData";
import { PersonalUserDataSectionT } from "@/modules/user-profile/components/tabs/user-contract/tabs/PersonalData/api/get-personal-data";

// declare context types
type UserDashboardCxtType = {
  isLoading: boolean;
  user: UserProfileData | undefined;
  userPersonalData: PersonalUserDataSectionT | undefined;
};

export const UserDashboardCxt = createContext<UserDashboardCxtType>(
  {} as UserDashboardCxtType
);

// ** create a custom hook to use the context
export const useUserDashboardCxt = () => {
  const context = useContext(UserDashboardCxt);
  if (!context) {
    throw new Error(
      "useUserDashboardCxt must be used within a UserDashboardCxtProvider"
    );
  }
  return context;
};

export const UserDashboardCxtProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const { data: user, isLoading } = useUserProfileData();

  const { data: userPersonalData } = useUserPersonalData();

  // ** handle side effects

  // ** declare and define component helper methods

  // ** return component ui
  return (
    <UserDashboardCxt.Provider
      value={{
        // user data
        user,
        isLoading,

        userPersonalData,
      }}
    >
      {children}
    </UserDashboardCxt.Provider>
  );
};
