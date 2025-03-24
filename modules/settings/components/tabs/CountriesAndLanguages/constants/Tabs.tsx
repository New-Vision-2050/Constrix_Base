import { SystemTab } from "@/modules/settings/types/SystemTab";
import CountriesSettingsTab from "../tabs/countries/tabs";

export const CountriesLanguagesTabs: SystemTab[] = [
  {
    id: "countries_and_languages_tabs_countries",
    title: "الدول",
    content: (
      <>
        <CountriesSettingsTab />
      </>
    ),
  },
];
