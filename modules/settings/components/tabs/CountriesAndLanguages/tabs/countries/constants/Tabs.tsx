import { SystemTab } from "@/modules/settings/types/SystemTab";
import CountriesTabCountriesSettingTab from "../tabs/CountriesSettings";
import UniversitiesSettingTab from "../tabs/UniversitiesSettings";
import AcademicSpecializationsSettingTab from "../tabs/AcademicSpecializations";
import AcademicQualificationsSettingTab from "../tabs/AcademicQualifications";

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
    content: (
      <>
        <UniversitiesSettingTab />
      </>
    ),
  },
  {
    id: "countries_tabs_hospitals_settings",
    title: "اعدادات المستشفيات",
    content: <>اعدادات المستشفيات</>,
  },
  {
    id: "countries_tabs_academic_qualifications_settings",
    title: "المؤهلات الاكاديمية",
    content: (
      <>
        <AcademicQualificationsSettingTab />
      </>
    ),
  },
  {
    id: "countries_tabs_academic_specializations_settings",
    title: "التخصصات الاكاديمية",
    content: (
      <>
        <AcademicSpecializationsSettingTab />
      </>
    ),
  },
];
