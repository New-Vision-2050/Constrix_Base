import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, DollarSign, Send, Lock } from "lucide-react";
import { useLocale } from "next-intl";
import CompanyFileTaps from "../company-file/company-file-taps";

const TAB_VALUES = {
  COMPANY: "company",
  CLIENTS: "clients",
  FINANCE: "finance",
  LEAVES: "leaves",
  USER_ACTIONS: "user_actions",
};

const CompanyProfileTaps = () => {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const tabs = [
    {
      label: "ملف الشركة",
      icon: <User size={18} />,
      value: TAB_VALUES.COMPANY,
      component: <CompanyFileTaps />,
    },
    {
      label: "العملاء",
      icon: <Briefcase size={18} />,
      value: TAB_VALUES.CLIENTS,
    },
    {
      label: "البيانات المالية",
      icon: <DollarSign size={18} />,
      value: TAB_VALUES.FINANCE,
    },
    { label: "الاجازات", icon: <Send size={18} />, value: TAB_VALUES.LEAVES },
    {
      label: "اجراءات المستخدم",
      icon: <Lock size={18} />,
      value: "user-actions",
    },
  ];

  return (
    <Tabs defaultValue={TAB_VALUES.COMPANY} className="w-full ">
      <TabsList
        className="w-full bg-sidebar text-foreground py-2 px-10 justify-between h-max mb-4"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            className="w-fit gap-2 data-[state=active]:bg-sidebar py-4 border-b-2 border-transparent data-[state=active]:border-primary rounded-none "
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

export default CompanyProfileTaps;
