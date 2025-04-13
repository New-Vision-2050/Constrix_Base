"use client";
import { SocialProvider } from "@/modules/settings/types/SocialProvider";
//hooks
import { createContext, useCallback, useContext, useState } from "react";

// TODO::declare and define context type
type SocialProviderCxtType = {
  activeSocialProvider: SocialProvider | undefined;
  handleChangeActiveProvider: (provider: SocialProvider) => void;
};

// TODO::create SocialProviderCxt
export const SocialProviderCxt = createContext<SocialProviderCxtType>({
  activeSocialProvider: undefined,
  handleChangeActiveProvider: () => {},
});

// custom hook to fasalitate reach SocialProviderCxt
export const useSocialProviderCxt = () => {
  try {
    const context = useContext(SocialProviderCxt);
    if (!context) {
      throw Error(
        "useSocialProviderCxt must be wrapped with SocialProviderCxtProvider"
      );
    }
    return context;
  } catch (error) {
    console.error("useSocialProviderCxt error : ", error);
    throw Error(
      "useSocialProviderCxt must be wrapped with SocialProviderCxtProvider"
    );
  }
};

// TODO::declare context provider
function SocialProviderCxtProvider({ children }: React.PropsWithChildren) {
  // * declare and define state and variables
  const [activeSocialProvider, setActiveSocialProvider] =
    useState<SocialProvider>();

  // * declare and define component methods
  const handleChangeActiveProvider = useCallback((provider: SocialProvider) => {
    setActiveSocialProvider(provider);
  }, []);

  // * return component ui
  return (
    <SocialProviderCxt.Provider
      value={{ activeSocialProvider, handleChangeActiveProvider }}
    >
      {children}
    </SocialProviderCxt.Provider>
  );
}

export default SocialProviderCxtProvider;
