import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { CountriesTabs } from "../constants/Tabs";

export default function CountriesSettingsTab() {
  // declare and define component state and variables
  // declare and define component helper methods
  // return component ui.
  return <HorizontalTabs list={CountriesTabs} />;
}
