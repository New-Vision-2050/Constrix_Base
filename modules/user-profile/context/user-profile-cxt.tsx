"use client";

// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useEffect, useState } from "react";
import useUserProfileData from "../hooks/useUserProfileData";
import { UserProfileData } from "../types/user-profile-response";
import useProfileDataStatus from "../hooks/useProfileDataStatus";
import { ProfileDataStatus } from "../types/profile-data-status";

// declare context types
type UserProfileCxtType = {
  isLoading: boolean;
  user: UserProfileData | undefined;
  handleUpdateImage: (imgUrl: string) => void;

  // data status
  userDataStatus: ProfileDataStatus | undefined;
  handleRefetchDataStatus: () => void;
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
  const [user, setUser] = useState<UserProfileData>();
  const { data: _user, isLoading } = useUserProfileData();
  const { data: userDataStatus, refetch: refetchDataStatus } =
    useProfileDataStatus(_user?.user_id ?? "");

  console.log("userDataStatus", userDataStatus);

  // ** handle side effects
  useEffect(() => {
    if (_user) setUser(_user);
  }, [_user]);

  // ** declare and define component helper methods
  const handleRefetchDataStatus = () => {
    refetchDataStatus();
  };

  const handleUpdateImage = (imgUrl: string) => {
    if (user) setUser({ ...user, image_url: imgUrl });
  };

  // ** return component ui
  return (
    <UserProfileCxt.Provider
      value={{
        // user data
        user,
        isLoading,
        handleUpdateImage,

        // user data status
        userDataStatus,
        handleRefetchDataStatus,
      }}
    >
      {children}
    </UserProfileCxt.Provider>
  );
};
