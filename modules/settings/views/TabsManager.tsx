// shad-cn tab
import { Tabs, TabsList } from "@/components/ui/tabs";
import TabsTriggerList from "../components/TabsTriggerList";
import TabsContentList from "../components/TabsContentList";
import { useLocale } from "next-intl";

export default function TabsManager() {
  // declare and define component state and variables
  const locale = useLocale();
  const isRtl = locale === "ar";
  // declare and define component helper methods
  // return component ui.
  return (
    <Tabs
      defaultValue="account"
      dir={isRtl ? "rtl" : "ltr"}
      className={isRtl ? "text-right" : "text-left"}
    >
      <TabsList className="bg-transparent ">
        <TabsTriggerList />
      </TabsList>
      <TabsContentList />
    </Tabs>
  );
}
