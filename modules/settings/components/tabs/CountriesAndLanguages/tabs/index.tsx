// shad-cn tab
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useLocale } from "next-intl";
import TabsTriggerList from "../../../TabsTriggerList";
import TabsContentList from "../../../TabsContentList";
import { CountriesLanguagesTabs } from "../constants/Tabs";

export default function CountriesAndLanguagesSettingsTab() {
  // declare and define component state and variables
  const locale = useLocale();
  const isRtl = locale === "ar";
  // declare and define component helper methods
  // return component ui.
  return (
    <Tabs
      defaultValue="countries_and_languages_tabs_countries"
      dir={isRtl ? "rtl" : "ltr"}
      className={`${isRtl ? "text-right" : "text-left"} w-full`}
    >
      <TabsList className="bg-transparent min-h-14 overflow-x-auto whitespace-nowrap scrollbar-hide flex items-center justify-start">
        <TabsTriggerList list={CountriesLanguagesTabs} />
      </TabsList>
      <TabsContentList list={CountriesLanguagesTabs} />
    </Tabs>
  );
}
