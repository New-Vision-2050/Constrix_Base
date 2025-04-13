// shad-cn tab
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useLocale } from "next-intl";
import { CountriesTabs } from "../constants/Tabs";
import TabsTriggerList from "@/modules/settings/components/TabsTriggerList";
import TabsContentList from "@/modules/settings/components/TabsContentList";

export default function CountriesSettingsTab() {
  // declare and define component state and variables
  const locale = useLocale();
  const isRtl = locale === "ar";
  // declare and define component helper methods
  // return component ui.
  return (
    <Tabs
      defaultValue="countries_tabs_countries_settings"
      dir={isRtl ? "rtl" : "ltr"}
      className={`${isRtl ? "text-right" : "text-left"} w-full`}
    >
      <TabsList className="bg-transparent min-h-14 overflow-x-auto whitespace-nowrap scrollbar-hide flex items-center justify-start">
        <TabsTriggerList list={CountriesTabs} />
      </TabsList>
      <TabsContentList list={CountriesTabs} />
    </Tabs>
  );
}
