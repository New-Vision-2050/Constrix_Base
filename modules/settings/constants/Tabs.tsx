import ChatSettingsTab from "../components/tabs/ChatSettings";
import CountriesTab from "../components/tabs/countries";
import IdentifierSettingTab from "../components/tabs/IdentifierSetting";
import { SystemTab } from "../types/SystemTab";

export const SystemSettingTabs: SystemTab[] = [
  // {
  //   id: "CompanyData",
  //   title: "بيانات الشركة",
  //   content: "بيانات الشركة",
  // },
  // {
  //   id: "SystemRoles",
  //   title: "ادوار النظام",
  //   content: "ادوار النظام",
  // },
  {
    id: "IdentifierSetting",
    title: "اعدادات المعرف",
    content: (
      <>
        <IdentifierSettingTab />
      </>
    ),
  },
  {
    id: "LanguagesAndCountries",
    title: "الدول واللغات",
    content: (
      <>
        <CountriesTab />
      </>
    ),
  },
  {
    id: "ChatSettings",
    title: "اعدادات المراسلات",
    content: (
      <>
        <ChatSettingsTab />
      </>
    ),
  },
  // {
  //   id: "StorageSettings",
  //   title: "اعدادات التخزين",
  //   content: "اعدادات التخزين",
  // },
  // {
  //   id: "CompanyTypes",
  //   title: "انواع الشركات",
  //   content: "انواع الشركات",
  // },
  // {
  //   id: "AppAndWebsiteSettings",
  //   title: "اعدادات الموقع والتطبيقات",
  //   content: "اعدادات الموقع والتطبيقات",
  // },
];
