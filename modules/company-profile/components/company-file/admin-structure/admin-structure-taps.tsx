import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, MapPin } from "lucide-react";
import { useLocale } from "next-intl";

const AdminStructureTaps = () => {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const tabs = [
    {
      label: "الهيكل العام",
      icon: <User size={18} />,
      value: "general-structure",
    },
    {
      label: "الهيكل التسلسلي",
      icon: <MapPin size={18} />,
      value: "hierarchy-structure",
    },
    {
      label: "هيكل الموظفين",
      icon: <Lock size={18} />,
      value: "employees-structure",
      component: <AdminStructureTaps />,
    },
  ];

  return (
    <Tabs defaultValue={"general-structure"} className="w-full">
      <TabsList
        className="w-full bg-transparent py-0 px-10 justify-start gap-20 h-max border-b mb-4"
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
    </Tabs>
  );
};

export default AdminStructureTaps;
