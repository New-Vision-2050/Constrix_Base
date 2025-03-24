"use client";
//hooks
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useDriversData from "../../../hooks/useDriversData";
import { Driver } from "@/modules/settings/types/Driver";
import { DriverTypes } from "../../../constants/DriversTypes";

// TODO::declare and define context type
type MailProviderCxtType = {
  activeMailProvider: Driver | undefined;
  handleChangeActiveProvider: (provider: Driver) => void;
  // drivers data
  drivers: Driver[];
  loadingDrivers: boolean;
};

// TODO::create MailProviderCxt
export const MailProviderCxt = createContext<MailProviderCxtType>({
  activeMailProvider: undefined,
  handleChangeActiveProvider: () => {},
  // drivers data
  drivers: [],
  loadingDrivers: false,
});

// custom hook to fasalitate reach MailProviderCxt
export const useMailProviderCxt = () => {
  try {
    const context = useContext(MailProviderCxt);
    if (!context) {
      throw Error(
        "useMailProviderCxt must be wrapped with MailProviderCxtProvider"
      );
    }
    return context;
  } catch (error) {
    console.error("useMailProviderCxt error : ", error);
    throw Error(
      "useMailProviderCxt must be wrapped with MailProviderCxtProvider"
    );
  }
};

// TODO::declare context provider
function MailProviderCxtProvider({ children }: React.PropsWithChildren) {
  // * declare and define state and variables
  const [activeMailProvider, setActiveMailProvider] = useState<Driver>();
  const { data: drivers, isLoading: loadingDrivers } = useDriversData({
    driverType: DriverTypes.Mail,
  });

  // handle side effects
  useEffect(() => {
    if (drivers) {
      setActiveMailProvider(drivers?.[0]);
    }
  }, [drivers]);

  // * declare and define component methods
  const handleChangeActiveProvider = useCallback((provider: Driver) => {
    setActiveMailProvider(provider);
  }, []);

  // * return component ui
  return (
    <MailProviderCxt.Provider
      value={{
        activeMailProvider,
        handleChangeActiveProvider,
        drivers: drivers ?? [],
        loadingDrivers,
      }}
    >
      {children}
    </MailProviderCxt.Provider>
  );
}

export default MailProviderCxtProvider;
