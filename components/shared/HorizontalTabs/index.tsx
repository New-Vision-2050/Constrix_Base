// shad-cn tab
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useLocale } from "next-intl";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import TabsTriggerList from "./TabsTriggerList";
import TabsContentList from "./TabsContentList";

type PropsT = {
  defaultValue?: string;
  list: SystemTab[];
};
export default function HorizontalTabs({ list, defaultValue }: PropsT) {
  // declare and define component state and variables.
  const locale = useLocale();
  const isRtl = locale === "ar";
  // declare and define component helper methods.
  // return component ui.
  return (
    <Tabs
      defaultValue={defaultValue ?? list?.[0]?.id ?? "_"}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${isRtl ? "text-right" : "text-left"} w-full`}
    >
      <TabsList className="bg-transparent min-h-14 overflow-x-auto whitespace-nowrap scrollbar-hide flex items-center justify-start">
        <TabsTriggerList list={list} />
      </TabsList>
      <TabsContentList list={list} />
    </Tabs>
  );
}
