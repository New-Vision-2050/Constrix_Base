"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { useBreadcrumb } from "@/components/shared/breadcrumbs";
import {
  type ContractualEngagementKey,
  getContractualEngagementTitleKey,
} from "@/modules/projects/project/constants/contractualEngagementKeys";

interface ContractualEngagementContextType {
  contractualEngagementKey: ContractualEngagementKey;
}

const ContractualEngagementContext =
  createContext<ContractualEngagementContextType | undefined>(undefined);

export function ContractualEngagementProvider({
  contractualEngagementKey,
  children,
}: {
  contractualEngagementKey: ContractualEngagementKey;
  children: ReactNode;
}) {
  const t = useTranslations("Sidebar");
  const { setPageTitle } = useBreadcrumb();
  const titleKey = getContractualEngagementTitleKey(contractualEngagementKey);

  useEffect(() => {
    setPageTitle(t(titleKey));
    return () => setPageTitle(null);
  }, [contractualEngagementKey, setPageTitle, t, titleKey]);

  return (
    <ContractualEngagementContext.Provider
      value={{ contractualEngagementKey }}
    >
      {children}
    </ContractualEngagementContext.Provider>
  );
}

export function useContractualEngagement() {
  const context = useContext(ContractualEngagementContext);
  if (!context) {
    throw new Error(
      "useContractualEngagement must be used within ContractualEngagementProvider",
    );
  }
  return context;
}

export function useOptionalContractualEngagement() {
  return useContext(ContractualEngagementContext);
}
