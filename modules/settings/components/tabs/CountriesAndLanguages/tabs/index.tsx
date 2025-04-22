import { CountriesLanguagesTabs } from "../constants/Tabs";
import HorizontalTabs from "@/components/shared/HorizontalTabs";

export default function CountriesAndLanguagesSettingsTab() {
  // declare and define component state and variables
  // declare and define component helper methods
  // return component ui.
  return <HorizontalTabs list={CountriesLanguagesTabs} />;
}
