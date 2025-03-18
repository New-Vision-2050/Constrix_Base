// shad-cn tab
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useLocale } from "next-intl";
import TabsTriggerList from "../../TabsTriggerList";
import TabsContentList from "../../TabsContentList";
import { IdentifierSettingTabs } from "./constants/Tabs";

export default function IdentifierSettingTab() {
  // declare and define component state and variables
  const locale = useLocale();
  const isRtl = locale === "ar";
  // declare and define component helper methods
  // return component ui.
  return (
    <Tabs
      defaultValue="account"
      dir={isRtl ? "rtl" : "ltr"}
      className={`${isRtl ? "text-right" : "text-left"} w-full`}
    >
      <TabsList className="bg-transparent overflow-y-hidden overflow-x-auto whitespace-nowrap scrollbar-hide flex items-center justify-start">
        <TabsTriggerList list={IdentifierSettingTabs} />
      </TabsList>
      <TabsContentList list={IdentifierSettingTabs} />
    </Tabs>
  );
}
