import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, MapPin } from "lucide-react";
import { useLocale } from "next-intl";
import GeneralStructure from "./general-structure";
import EmployeeStructure from "./employee-structure";
import SerialStructure from "./serial-structure";

const AdminStructureTaps = () => {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const tabs = [
    {
      label: "الهيكل العام",
      icon: <User size={18} />,
      value: "general-structure",
      component: <GeneralStructure />,
    },
    {
      label: "الهيكل التسلسلي",
      icon: <MapPin size={18} />,
      value: "serial-structure",
      component: <SerialStructure />,
    },
    {
      label: "هيكل الموظفين",
      icon: <Lock size={18} />,
      value: "employees-structure",
      component: <EmployeeStructure />,
    },
  ];

  return (
    <Tabs defaultValue={"general-structure"} className="w-full">
      <TabsList
        className="w-full bg-transparent py-0 px-10 justify-start gap-20 h-max border-b rounded-none mb-4"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            className="w-fit gap-2 data-[state=active]:bg-sidebar py-2 border-b-2 border-transparent data-[state=active]:border-primary rounded-none "
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

export default AdminStructureTaps;
