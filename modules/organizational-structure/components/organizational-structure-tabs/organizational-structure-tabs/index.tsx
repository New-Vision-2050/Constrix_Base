'use client'

import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { OrganizationalStructureSubTabs } from "@/modules/organizational-structure/constants/organizational-structure-tabs";
import { useTranslations } from "next-intl";

export default function OrganizationalStructureTabTabs() {
  // declare and define component state and variables
  const t = useTranslations(
    "CompanyStructure.tabs.mainTabs.organizational-structure-main-tab-1.tabs"
  );
  // declare and define component helper methods
  // return component ui.
  return <HorizontalTabs list={OrganizationalStructureSubTabs(t)} />;
}
