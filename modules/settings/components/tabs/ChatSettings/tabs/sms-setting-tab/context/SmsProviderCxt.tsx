"use client";
//hooks
import { createContext, useCallback, useContext, useState } from "react";
import useDriversData from "../../../hooks/useDriversData";
import { DriverTypes } from "../../../constants/DriversTypes";
import { Driver } from "@/modules/settings/types/Driver";

// TODO::declare and define context type
type SmsProviderCxtType = {
  activeSmsProvider: Driver | undefined;
  handleChangeActiveProvider: (provider: Driver) => void;
  // drivers data
  drivers: Driver[];
  loadingDrivers: boolean;
};

// TODO::create SmsProviderCxt
export const SmsProviderCxt = createContext<SmsProviderCxtType>({
  activeSmsProvider: undefined,
  handleChangeActiveProvider: () => {},
  // drivers data
  drivers: [],
  loadingDrivers: false,
});

// custom hook to fasalitate reach SmsProviderCxt
export const useSmsProviderCxt = () => {
  try {
    const context = useContext(SmsProviderCxt);
    if (!context) {
      throw Error(
        "useSmsProviderCxt must be wrapped with SmsProviderCxtProvider"
      );
    }
    return context;
  } catch (error) {
    console.error("useSmsProviderCxt error : ", error);
    throw Error(
      "useSmsProviderCxt must be wrapped with SmsProviderCxtProvider"
    );
  }
};

// TODO::declare context provider
function SmsProviderCxtProvider({ children }: React.PropsWithChildren) {
  // * declare and define state and variables
  const [activeSmsProvider, setActiveSmsProvider] = useState<Driver>();
  const { data: drivers, isLoading: loadingDrivers } = useDriversData({
    driverType: DriverTypes.SMS,
  });

  // * declare and define component methods
  const handleChangeActiveProvider = useCallback((provider: Driver) => {
    setActiveSmsProvider(provider);
  }, []);

  // * return component ui
  return (
    <SmsProviderCxt.Provider
      value={{
        activeSmsProvider,
        handleChangeActiveProvider,
        drivers: drivers ?? [],
        loadingDrivers,
      }}
    >
      {children}
    </SmsProviderCxt.Provider>
  );
}

export default SmsProviderCxtProvider;
