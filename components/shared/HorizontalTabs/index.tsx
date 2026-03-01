// shad-cn tab
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useLocale } from "next-intl";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import TabsTriggerList from "./TabsTriggerList";
import TabsContentList from "./TabsContentList";

type PropsT = {
  defaultValue?: string;
  value?: string;
  list: SystemTab[];
  onTabClick?: (tab: SystemTab) => void;
  bgStyleApproach?: boolean;
  additionalClassiess?: string;
};

export default function HorizontalTabs({
  list,
  onTabClick,
  defaultValue,
  value,
  bgStyleApproach,
  additionalClassiess,
}: PropsT) {
  // declare and define component state and variables.
  const locale = useLocale();
  const isRtl = locale === "ar";
  const bgColor = bgStyleApproach ? "bg-sidebar" : "bg-transparent";
  const justifyContent =
    list?.length > 3 ? "justify-between" : "justify-start gap-4";
  // declare and define component helper methods.
  // return component ui.
  return (
    <Tabs
      value={value}
      defaultValue={defaultValue || list?.[0]?.id || "_"}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${isRtl ? "text-right" : "text-left"} w-full gap-3`}
    >
      <TabsList
        className={`${bgColor} min-h-14 overflow-x-auto whitespace-nowrap scrollbar-hide flex items-center ${justifyContent} ${additionalClassiess}`}
      >
        <TabsTriggerList
          onTabClick={onTabClick}
          list={list}
          bgStyleApproach={bgStyleApproach}
        />
      </TabsList>
      <TabsContentList list={list} />
    </Tabs>
  );
}
