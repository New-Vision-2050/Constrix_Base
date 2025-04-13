import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, MapPin } from "lucide-react";
import { useLocale } from "next-intl";
import AdminStructureTaps from "./admin-structure/admin-structure-taps";

const CompanyFileTaps = () => {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const tabs = [
    {
      label: "البيانات الرسمية",
      icon: <User size={18} />,
      value: "data",
    },
    {
      label: "الفروع",
      icon: <MapPin size={18} />,
      value: "branches",
    },
    {
      label: "الهيكل الإداري",
      icon: <Lock size={18} />,
      value: "structure",
      component: <AdminStructureTaps />,
    },
    {
      label: "الموارد البشرية",
      icon: <Lock size={18} />,
      value: "hr",
    },
    {
      label: "الآوراق الرسمية",
      icon: <Lock size={18} />,
      value: "paper",
    },
  ];

  return (
    <Tabs defaultValue={"structure"} className="w-full">
      <TabsList
        className="w-full bg-transparent py-0 px-10 justify-between h-max border-b rounded-none mb-4"
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

export default CompanyFileTaps;
