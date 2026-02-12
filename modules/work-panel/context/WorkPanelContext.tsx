"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "@i18n/navigation";

interface WorkPanelContextType {
  tab1: string;
  setTab1: React.Dispatch<React.SetStateAction<string>>;
  tab2: string;
  setTab2: React.Dispatch<React.SetStateAction<string>>;
  verticalSection: string;
  setVerticalSection: React.Dispatch<React.SetStateAction<string>>;
}

const WorkPanelContext = createContext<WorkPanelContextType | undefined>(
  undefined
);

export function WorkPanelProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  
  const [tab1, setTab1] = useState<string>(
    searchParams.get("tab1") || "work-panel-tab-indicators"
  );
  const [tab2, setTab2] = useState<string>(
    searchParams.get("tab2") || "procedures-expired-ids"
  );
  const [verticalSection, setVerticalSection] = useState<string>(
    searchParams.get("verticalSection") || "all-branches"
  );

  // Update URL params when tabs change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (tab1) {
      params.set("tab1", tab1);
    } else {
      params.delete("tab1");
    }

    if (tab2) {
      params.set("tab2", tab2);
    } else {
      params.delete("tab2");
    }

    if (verticalSection) {
      params.set("verticalSection", verticalSection);
    } else {
      params.delete("verticalSection");
    }

    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [tab1, tab2, verticalSection, searchParams]);

  return (
    <WorkPanelContext.Provider
      value={{
        tab1,
        setTab1,
        tab2,
        setTab2,
        verticalSection,
        setVerticalSection,
      }}
    >
      {children}
    </WorkPanelContext.Provider>
  );
}

export function useWorkPanelContext() {
  const context = useContext(WorkPanelContext);
  if (context === undefined) {
    throw new Error(
      "useWorkPanelContext must be used within a WorkPanelProvider"
    );
  }
  return context;
}
