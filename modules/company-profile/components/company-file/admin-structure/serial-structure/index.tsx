import { MapPin, CircleCheck } from "lucide-react";
import { useLocale } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SerialCompanyStructure from "./serial-company-structure";

const SerialStructure = () => {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const tabs = [
    {
      label: "بيانات الهيكل التسلسلي",
      value: "general",
      component: <SerialCompanyStructure />,
    },
    {
      label: "الفرع الرئيسي -فرع الرياض",
      value: "main-branch",
    },
    {
      label: "فرع جدة",
      value: "jaddah",
    },
    {
      label: "فرع مكة",
      value: "mecca",
    },
    {
      label: "فرع القاهرة",
      value: "cairo",
    },
  ];
  return (
    <div>
      <Tabs
        defaultValue="general"
        className="w-full flex flex-col md:flex-row"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <TabsList
          className="flex flex-col bg-sidebar p-2 w-32 h-full gap-4 rounded-lg justify-start"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              className="flex items-start justify-between w-full px-2 py-4 rounded-md data-[state=active]:bg-sidebar gap-2 whitespace-normal"
              value={tab.value}
            >
              <div className="flex text-sm items-start text-start gap-2 grow">
                <MapPin size={18} className="shrink-0" />
                {tab.label}
              </div>
              <CircleCheck
                size={18}
                className="text-green-500 shrink-0 me-auto"
              />
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-1">
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              dir={isRtl ? "rtl" : "ltr"}
              className="h-full pr-6"
            >
              {tab.component}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default SerialStructure;
