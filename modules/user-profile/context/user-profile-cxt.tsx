"use client";

// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useEffect, useState } from "react";
import useUserProfileData from "../hooks/useUserProfileData";
import { UserProfileData } from "../types/user-profile-response";

// declare context types
type UserProfileCxtType = {
  isLoading: boolean;
  user: UserProfileData | undefined;
  handleUpdateImage: (imgUrl: string) => void;
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
  const { data: _user, isLoading } = useUserProfileData();
  const [user, setUser] = useState<UserProfileData>();

  // ** handle side effects
  useEffect(() => {
    if (_user) setUser(_user);
  }, [_user]);

  // ** declare and define component helper methods
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
      }}
    >
      {children}
    </UserProfileCxt.Provider>
  );
};
