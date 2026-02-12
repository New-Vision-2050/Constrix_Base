import { SystemTab } from "@/modules/settings/types/SystemTab";
import { Target, FileCheck, Briefcase } from "lucide-react";
import IndicatorsTab from "../tabs/IndicatorsTab";
import ProceduresTab from "../tabs/ProceduresTab";
import MyServicesTab from "../tabs/MyServicesTab";

export const GetWorkPanelMainTabs = (
  t: (key: string) => string
): SystemTab[] => {
  const tabs: SystemTab[] = [
    {
      id: "work-panel-tab-indicators",
      title: t("indicators"),
      icon: <Target />,
      content: <IndicatorsTab />,
    },
    {
      id: "work-panel-tab-procedures",
      title: t("procedures"),
      icon: <FileCheck />,
      content: <ProceduresTab />,
    },
    {
      id: "work-panel-tab-my-services",
      title: t("myServices"),
      icon: <Briefcase />,
      content: <MyServicesTab />,
    },
  ];

  return tabs;
};

