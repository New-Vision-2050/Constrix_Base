import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { OrganizationalStructureSubTabs } from "@/modules/organizational-structure/constants/organizational-structure-tabs";

export default function OrganizationalStructureTabTabs() {
  // declare and define component state and variables
  // declare and define component helper methods
  // return component ui.
  return (
    <HorizontalTabs list={OrganizationalStructureSubTabs} />
  );
}
