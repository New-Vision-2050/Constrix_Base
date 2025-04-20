"use client";

// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext } from "react";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import useUserStatusData from "../hooks/useUserStatusData";
import { UserStatusT } from "../api/get-user-status";

// declare context types
type UserActionsCxtType = {
  userStatusData: UserStatusT | undefined;
  handleRefreshUserStatus: () => void;
  userStatusLoading: boolean;
};

export const UserActionsCxt = createContext<UserActionsCxtType>(
  {} as UserActionsCxtType
);

// ** create a custom hook to use the context
export const useUserActionsCxt = () => {
  const context = useContext(UserActionsCxt);
  if (!context) {
    throw new Error(
      "useUserActionsCxt must be used within a UserActionsCxtProvider"
    );
  }
  return context;
};

export const UserActionsCxtProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const { user } = useUserProfileCxt();
  const {
    data: userStatusData,
    refetch: refetchUserStatus,
    isLoading: userStatusLoading,
  } = useUserStatusData(user?.user_id ?? "");

  // ** declare and define component helper methods
  const handleRefreshUserStatus = () => {
    refetchUserStatus();
  };

  // ** return component ui
  return (
    <UserActionsCxt.Provider
      value={{ userStatusLoading, userStatusData, handleRefreshUserStatus }}
    >
      {children}
    </UserActionsCxt.Provider>
  );
};
