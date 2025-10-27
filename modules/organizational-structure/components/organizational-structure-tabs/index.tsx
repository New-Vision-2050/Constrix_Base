"use client"
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { OrganizationalStructureMainTabs } from "../../constants/main-tabs";
import { useTranslations } from "next-intl";

export default function OrganizationalStructureTabs() {
  // declare and define component state and variables
  const t = useTranslations("CompanyStructure.tabs.mainTabs");
  // declare and define component helper methods
  // return component ui.
  return (
    <HorizontalTabs bgStyleApproach list={OrganizationalStructureMainTabs(t)} />
  );
}
