"use client";

// types
import type { ReactNode } from "react";

// import packages
import { createContext, useContext, useState } from "react";

// declare context types
type ConnectionOTPCxtType = {
  openMailOtp: boolean;
  openPhoneOtp: boolean;
  mailOtpIdentifier: string;
  phoneOtpIdentifier: string;

  toggleMailOtpDialog: () => void;
  togglePhoneOtpDialog: () => void;
  setMailOtpIdentifier: (identifier: string) => void;
  setPhoneOtpIdentifier: (identifier: string) => void;
};

export const ConnectionOTPCxt = createContext<ConnectionOTPCxtType>({
  toggleMailOtpDialog: () => {},
  setMailOtpIdentifier: () => {},
  setPhoneOtpIdentifier: () => {},
} as ConnectionOTPCxtType);

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
  const [mailOtpIdentifier, setMailOtpIdentifier] = useState("");
  const [phoneOtpIdentifier, setPhoneOtpIdentifier] = useState("");

  // ** handle side effects

  // ** declare and define component helper methods
  const toggleMailOtpDialog = () => {
    setOpenMailOtp((prev) => !prev);
  };
  const togglePhoneOtpDialog = () => setOpenPhoneOtp((prev) => !prev);

  // ** return component ui
  return (
    <ConnectionOTPCxt.Provider
      value={{
        openMailOtp,
        openPhoneOtp,
        mailOtpIdentifier,
        phoneOtpIdentifier,
        toggleMailOtpDialog,
        togglePhoneOtpDialog,
        setMailOtpIdentifier,
        setPhoneOtpIdentifier,
      }}
    >
      {children}
    </ConnectionOTPCxt.Provider>
  );
};
