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
  component?: React.ComponentType<{ projectTypeId: number | null }>;
}

export const CURRENT_TABS: ProjectSettingsTab[] = [
  {
    name: "بيانات المشروع",
    value: "project-details",
    schema_id: 1,
    component: DetailsView,
  },
  {
    name: "بنود المشروع",
    value: "project-terms",
    schema_id: 2,
    component: ProjectTermsView,
  },
  {
    name: "المرفقات",
    value: "attachments",
    schema_id: 3,
    component: AttachmentsView,
  },
  {
    name: "المقاولين",
    value: "contractors",
    schema_id: 4,
    component: ContractorsView,
  },
  {
    name: "الكادر",
    value: "team",
    schema_id: 5,
    component: TeamView,
  },
  {
    name: "اوامر العمل",
    value: "work-orders",
    schema_id: 6,
    component: WorkOrdersView,
  },
  {
    name: "المالية",
    value: "financial",
    schema_id: 7,
    component: FinancialView,
  },
  {
    name: "ادارة العقد",
    value: "contract-management",
    schema_id: 8,
    component: ContractManagementView,
  },
];
