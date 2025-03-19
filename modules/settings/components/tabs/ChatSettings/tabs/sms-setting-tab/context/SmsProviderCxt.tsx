"use client";
import { SmsProvider } from "@/modules/settings/types/SmsProvider";
//hooks
import { createContext, useCallback, useContext, useState } from "react";

// TODO::declare and define context type
type SmsProviderCxtType = {
  activeSmsProvider: SmsProvider | undefined;
  handleChangeActiveProvider: (provider: SmsProvider) => void;
};

// TODO::create SmsProviderCxt
export const SmsProviderCxt = createContext<SmsProviderCxtType>({
  activeSmsProvider: undefined,
  handleChangeActiveProvider: () => {},
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
  const [activeSmsProvider, setActiveSmsProvider] = useState<SmsProvider>();

  // * declare and define component methods
  const handleChangeActiveProvider = useCallback((provider: SmsProvider) => {
    setActiveSmsProvider(provider);
  }, []);

  // * return component ui
  return (
    <SmsProviderCxt.Provider
      value={{ activeSmsProvider, handleChangeActiveProvider }}
    >
      {children}
    </SmsProviderCxt.Provider>
  );
}

export default SmsProviderCxtProvider;
