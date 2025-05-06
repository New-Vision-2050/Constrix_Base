import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { OrganizationalStructureMainTabs } from "../../constants/main-tabs";

export default function OrganizationalStructureTabs() {
  // declare and define component state and variables
  // declare and define component helper methods
  // return component ui.
  return (
    <HorizontalTabs bgStyleApproach list={OrganizationalStructureMainTabs} />
  );
}
