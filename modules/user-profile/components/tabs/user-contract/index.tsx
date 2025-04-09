// shad-cn tab
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useLocale } from "next-intl";
import TabsTriggerList from "../../TabsTriggerList";
import TabsContentList from "../../TabsContentList";
import { UserContractTabsList } from "./constants/UserContractTabs";

export default function UserContractTab() {
  // declare and define component state and variables.
  const locale = useLocale();
  const isRtl = locale === "ar";
  // declare and define component helper methods.
  // return component ui.
  return (
    <Tabs
      defaultValue="account"
      dir={isRtl ? "rtl" : "ltr"}
      className={`${isRtl ? "text-right" : "text-left"} w-full`}
    >
      <TabsList className="bg-transparent min-h-14 overflow-x-auto whitespace-nowrap scrollbar-hide flex items-center justify-start">
        <TabsTriggerList list={UserContractTabsList} />
      </TabsList>
      <TabsContentList list={UserContractTabsList} />
    </Tabs>
  );
}
