"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Tab } from "@/types/Tab";
import { useLocale } from "next-intl";

const TabsGroup = ({
  tabs,
  defaultValue,
  variant,
  tabsListClassNames,
  tabsTriggerClassNames,
}: {
  tabs: Tab[];
  defaultValue: string;
  variant: "primary" | "secondary";
  tabsListClassNames?: string;
  tabsTriggerClassNames?: string;
}) => {
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <Tabs defaultValue={defaultValue} className="w-full ">
      <TabsList
        className={cn(
          "w-full  px-10 justify-between h-max mb-4",
          variant === "primary" && "bg-sidebar py-2 text-foreground",
          variant === "secondary" && "bg-transparent py-0 border-b rounded-none",
          tabsListClassNames
        )}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            className={cn(
              "w-fit gap-2 data-[state=active]:bg-sidebar border-b-2 border-transparent data-[state=active]:border-primary rounded-none ",
              variant === "primary" && "py-4",
              variant === "secondary" && "py-2",
              tabsTriggerClassNames
            )}
            value={tab.value}
          >
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsGroup;
