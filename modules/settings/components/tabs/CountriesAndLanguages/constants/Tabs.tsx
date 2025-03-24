import { SystemTab } from "@/modules/settings/types/SystemTab";
import CountriesSettingsTab from "../tabs/countries/tabs";
import LanguagesSettingsTab from "../tabs/languages";

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
  {
    id: "countries_and_languages_tabs_languages",
    title: "اللغات",
    content: (
      <>
        <LanguagesSettingsTab />
      </>
    ),
  },
  {
    id: "countries_and_languages_tabs_cities",
    title: "المدن",
    content: <>المدن</>,
  },
  {
    id: "countries_and_languages_tabs_governorates",
    title: "المحافظات",
    content: <>المحافظات</>,
  },
];
