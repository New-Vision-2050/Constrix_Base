import DetailsView from "../views/main-view/tab-views/details";
import ProjectTermsView from "../views/main-view/tab-views/project-terms";
import AttachmentsView from "../views/main-view/tab-views/attachments/index";
import ContractorsView from "../views/main-view/tab-views/contractors";
import TeamView from "../views/main-view/tab-views/team";
import WorkOrdersView from "../views/main-view/tab-views/work-orders";
import FinancialView from "../views/main-view/tab-views/financial";
import ContractManagementView from "../views/main-view/tab-views/contract-management";


export interface ProjectSettingsTab {
  name: string;
  value: string;
  /** Backend schema ID for ProjectTypesApi - used when creating project types */
  schema_id?: number;
  component?: React.ReactNode;
}

export const CURRENT_TABS: ProjectSettingsTab[] = [
  {
    name: "بيانات المشروع",
    value: "project-details",
    component: <DetailsView />,
  },
  {
    name: "بنود المشروع",
    value: "project-terms",
    component: <ProjectTermsView />,
  },
  {
    name: "المرفقات",
    value: "attachments",
    component: <AttachmentsView />,
  },
  {
    name: "المقاولين",
    value: "contractors",
    component: <ContractorsView />,
  },
  {
    name: "الكادر",
    value: "team",
    component: <TeamView />,
  },
  {
    name: "اوامر العمل",
    value: "work-orders",
    component: <WorkOrdersView />,
  },
  {
    name: "المالية",
    value: "financial",
    component: <FinancialView />,
  },
  {
    name: "ادارة العقد",
    value: "contract-management",
    component: <ContractManagementView />,
  },
];
