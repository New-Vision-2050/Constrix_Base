import { SystemTab } from "@/modules/settings/types/SystemTab";
import { Target, FileCheck, Briefcase } from "lucide-react";
import IndicatorsTab from "../tabs/IndicatorsTab";
import ProceduresTab from "../tabs/ProceduresTab";
import MyServicesTab from "../tabs/MyServicesTab";
import { withPermissions } from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export type WorkPanelMainTab = SystemTab & { permission: string };

// Second-layer security: even when a tab is force-loaded via URL query state
// (e.g. ?tab1=work-panel-tab-indicators), these protected components will
// refuse to render without the required permission.
const ProtectedIndicatorsTab = withPermissions(IndicatorsTab, [
  PERMISSIONS.humanResources.charts.view,
]);
const ProtectedProceduresTab = withPermissions(ProceduresTab, [
  PERMISSIONS.humanResources.procedures.view,
]);
const ProtectedMyServicesTab = withPermissions(MyServicesTab, [
  PERMISSIONS.humanResources.services.view,
]);

export const GetWorkPanelMainTabs = (
  t: (key: string) => string,
): WorkPanelMainTab[] => {
  return [
    {
      id: "work-panel-tab-indicators",
      title: t("indicators"),
      icon: <Target />,
      content: <ProtectedIndicatorsTab />,
      permission: PERMISSIONS.humanResources.charts.view,
    },
    {
      id: "work-panel-tab-procedures",
      title: t("procedures"),
      icon: <FileCheck />,
      content: <ProtectedProceduresTab />,
      permission: PERMISSIONS.humanResources.procedures.view,
    },
    {
      id: "work-panel-tab-my-services",
      title: t("myServices"),
      icon: <Briefcase />,
      content: <ProtectedMyServicesTab />,
      permission: PERMISSIONS.humanResources.services.view,
    },
  ];
};
