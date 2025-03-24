import { SystemTab } from "@/modules/settings/types/SystemTab";
import CountriesTabCountriesSettingTab from "../tabs/CountriesSettings";

export const CountriesTabs: SystemTab[] = [
  {
    id: "countries_tabs_countries_settings",
    title: "اعدادات الدول",
    content: (
      <>
        <CountriesTabCountriesSettingTab />
      </>
    ),
  },
  {
    id: "countries_tabs__universities_settings",
    title: "اعدادات الجامعات",
    content: <>اعدادات الجامعات</>,
  },
  {
    id: "countries_tabs_hospitals_settings",
    title: "اعدادات المستشفيات",
    content: <>اعدادات المستشفيات</>,
  },
];
