"use client";

// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useState } from "react";

// declare context types
type ConnectionOTPCxtType = {
  openMailOtp: boolean;
  openPhoneOtp: boolean;

  toggleMailOtpDialog: () => void;
  togglePhoneOtpDialog: () => void;
};

export const ConnectionOTPCxt = createContext<ConnectionOTPCxtType>(
  {} as ConnectionOTPCxtType
);

// ** create a custom hook to use the context
export const useConnectionOTPCxt = () => {
  const context = useContext(ConnectionOTPCxt);
  if (!context) {
    throw new Error(
      "useConnectionOTPCxt must be used within a ConnectionOTPCxtProvider"
    );
  }
  return context;
};

export const ConnectionOTPCxtProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ** declare and define component state and variables
  const [openMailOtp, setOpenMailOtp] = useState(false);
  const [openPhoneOtp, setOpenPhoneOtp] = useState(false);

  // ** handle side effects

  // ** declare and define component helper methods
  const toggleMailOtpDialog = () => setOpenMailOtp((prev) => !prev);
  const togglePhoneOtpDialog = () => setOpenPhoneOtp((prev) => !prev);

  // ** return component ui
  return (
    <ConnectionOTPCxt.Provider
      value={{
        openMailOtp,
        openPhoneOtp,
        toggleMailOtpDialog,
        togglePhoneOtpDialog,
      }}
    >
      {children}
    </ConnectionOTPCxt.Provider>
  );
};
