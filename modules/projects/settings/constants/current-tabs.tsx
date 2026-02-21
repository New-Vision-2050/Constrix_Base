export const SCHEMA_IDS = {
  detailsView: 1,
  projectTerms: 2,
  attachments: 3,
  contractors: 4,
  team: 5,
  workOrders: 6,
  financial: 7,
  contractManagement: 8,
} as const;

export interface ProjectSettingsTab {
  name: string;
  value: string;
  schema_id?: number;
}

export const CURRENT_TABS: ProjectSettingsTab[] = [
  {
    name: "بيانات المشروع",
    value: "project-details",
    schema_id: SCHEMA_IDS.detailsView,
  },
  {
    name: "بنود المشروع",
    value: "project-terms",
    schema_id: SCHEMA_IDS.projectTerms,
  },
  {
    name: "المرفقات",
    value: "attachments",
    schema_id: SCHEMA_IDS.attachments,
  },
  {
    name: "المقاولين",
    value: "contractors",
    schema_id: SCHEMA_IDS.contractors,
  },
  {
    name: "الكادر",
    value: "team",
    schema_id: SCHEMA_IDS.team,
  },
  {
    name: "اوامر العمل",
    value: "work-orders",
    schema_id: SCHEMA_IDS.workOrders,
  },
  {
    name: "المالية",
    value: "financial",
    schema_id: SCHEMA_IDS.financial,
  },
  {
    name: "ادارة العقد",
    value: "contract-management",
    schema_id: SCHEMA_IDS.contractManagement,
  },
];
