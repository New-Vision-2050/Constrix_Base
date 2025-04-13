// shad-cn tab
import { Tabs, TabsList } from "@/components/ui/tabs";
import TabsTriggerList from "../components/TabsTriggerList";
import TabsContentList from "../components/TabsContentList";
import { useLocale } from "next-intl";
import { SystemSettingTabs } from "../constants/Tabs";

export default function TabsManager() {
  // declare and define component state and variables
  const locale = useLocale();
  const isRtl = locale === "ar";
  // declare and define component helper methods
  // return component ui.
  return (
    <Tabs
      defaultValue="SystemRoles"
      dir={isRtl ? "rtl" : "ltr"}
      className={`${isRtl ? "text-right" : "text-left"} w-full`}
    >
      <TabsList className="bg-transparent min-h-14 overflow-x-auto whitespace-nowrap scrollbar-hide flex items-center justify-start">
        <TabsTriggerList list={SystemSettingTabs} />
      </TabsList>
      <TabsContentList list={SystemSettingTabs} />
    </Tabs>
  );
}
