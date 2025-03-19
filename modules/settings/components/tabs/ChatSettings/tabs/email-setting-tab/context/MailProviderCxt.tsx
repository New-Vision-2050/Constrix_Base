'use client'
//hooks
import { MailProvider } from "@/modules/settings/types/MailProvider";
import { createContext, useCallback, useContext, useState } from "react";

// TODO::declare and define context type
type MailProviderCxtType = {
  activeMailProvider: MailProvider | undefined;
  handleChangeActiveProvider: (provider: MailProvider) => void;
};

// TODO::create MailProviderCxt
export const MailProviderCxt = createContext<MailProviderCxtType>({
  activeMailProvider: undefined,
  handleChangeActiveProvider: () => {},
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
  const [activeMailProvider, setActiveMailProvider] = useState<MailProvider>();

  // * declare and define component methods
  const handleChangeActiveProvider = useCallback((provider: MailProvider) => {
    setActiveMailProvider(provider);
  }, []);

  // * return component ui
  return (
    <MailProviderCxt.Provider
      value={{ activeMailProvider, handleChangeActiveProvider }}
    >
      {children}
    </MailProviderCxt.Provider>
  );
}

export default MailProviderCxtProvider;
