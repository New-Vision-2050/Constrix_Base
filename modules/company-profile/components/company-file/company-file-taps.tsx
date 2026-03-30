import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import AdminStructureTaps from "./admin-structure/admin-structure-taps";

const CompanyFileTaps = () => {
  const locale = useLocale();
  const t = useTranslations();
  const isRtl = locale === "ar";

  const tabs = [
    {
      label: t("Sidebar.OfficialData"),
      icon: <User size={18} />,
      value: "data",
    },
    {
      label: t("Sidebar.Branches"),
      icon: <MapPin size={18} />,
      value: "branches",
    },
    {
      label: t("Sidebar.AdministrativeStructure"),
      icon: <Lock size={18} />,
      value: "structure",
      component: <AdminStructureTaps />,
    },
    {
      label: t("Sidebar.HumanResources"),
      icon: <Lock size={18} />,
      value: "hr",
    },
    {
      label: t("Sidebar.OfficialPapers"),
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
