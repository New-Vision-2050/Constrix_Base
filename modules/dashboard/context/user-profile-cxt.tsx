"use client";

// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext } from "react";
import useUserProfileData from "../hooks/useUserProfileData";
import { UserProfileData } from "../types/user-profile-response";

// declare context types
type UserProfileCxtType = {
  isLoading: boolean;
  user: UserProfileData | undefined;
};

export const UserProfileCxt = createContext<UserProfileCxtType>(
  {} as UserProfileCxtType
);

// ** create a custom hook to use the context
export const useUserProfileCxt = () => {
  const context = useContext(UserProfileCxt);
  if (!context) {
    throw new Error(
      "useUserProfileCxt must be used within a UserProfileCxtProvider"
    );
  }
  return context;
};

export const UserProfileCxtProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const { data: user, isLoading } = useUserProfileData();

  console.log("user", user);

  // ** handle side effects

  // ** declare and define component helper methods

  // ** return component ui
  return (
    <UserProfileCxt.Provider
      value={{
        // user data
        user,
        isLoading,
      }}
    >
      {children}
    </UserProfileCxt.Provider>
  );
};
