"use client";

import React, { createContext, useContext, ReactNode } from "react";

// Define context type
interface CxtType {
  settingsBtnType: SettingsBtnsTypes;
  handleChangeSettingsBtnType: (type: SettingsBtnsTypes) => void;
}

// Create the context
const Cxt = createContext<CxtType | undefined>(undefined);

// Provider component
interface PropsT {
  children: ReactNode;
}

// settings btns types
export enum SettingsBtnsTypes {
  AddDoc,
  NotifySettings,
  ShareSettings,
}

export const DocsSettingsCxtProvider: React.FC<PropsT> = ({ children }) => {
  // ** declare and define helper variables
  const [settingsBtnType, setSettingsBtnType] =
    React.useState<SettingsBtnsTypes>(SettingsBtnsTypes.AddDoc);

  const handleChangeSettingsBtnType = (type: SettingsBtnsTypes) => {
    setSettingsBtnType(type);
  };

  // ** return provider
  return (
    <Cxt.Provider
      value={{
        settingsBtnType,
        handleChangeSettingsBtnType,
      }}
    >
      {children}
    </Cxt.Provider>
  );
};

// Custom hook to use the context
export const useDocsSettingsCxt = () => {
  const context = useContext(Cxt);
  if (context === undefined) {
    throw new Error(
      "useDocsSettingsCxt must be used within a DocsSettingsCxtProvider"
    );
  }
  return context;
};
