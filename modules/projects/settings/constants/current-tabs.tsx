import { useTranslations } from "next-intl";

export const SCHEMA_IDS = {
  detailsView: 1,
  projectTerms: 2,
  attachments: 3,
  contractors: 4,
  team: 5,
  workOrders: 6,
  financial: 7,
  contractManagement: 8,
  documentCycle: 9,
  rolesAndPermissions: 10,
  projectSharing: 11,
} as const;

export interface ProjectSettingsTab {
  name: string;
  value: string;
  schema_id?: number;
}

/** Static value → schema_id map for non-rendering logic (e.g. form submit) */
export const TAB_SCHEMA_ID_MAP: Record<string, number> = {
  "project-details": SCHEMA_IDS.detailsView,
  "project-terms": SCHEMA_IDS.projectTerms,
  attachments: SCHEMA_IDS.attachments,
  contractors: SCHEMA_IDS.contractors,
  team: SCHEMA_IDS.team,
  "work-orders": SCHEMA_IDS.workOrders,
  financial: SCHEMA_IDS.financial,
  "contract-management": SCHEMA_IDS.contractManagement,
  "document-cycle": SCHEMA_IDS.documentCycle,
  "roles-and-permissions": SCHEMA_IDS.rolesAndPermissions,
  "project-sharing": SCHEMA_IDS.projectSharing,
};

/** Reverse map: schema_id → tab value (for pre-filling from API schemas) */
export const SCHEMA_ID_TO_TAB_VALUE: Record<number, string> = Object.fromEntries(
  Object.entries(TAB_SCHEMA_ID_MAP).map(([value, id]) => [id, value]),
);

/** Hook that returns translated tabs for rendering */
export function useProjectSettingsTabs(): ProjectSettingsTab[] {
  const t = useTranslations("Projects.Settings.projectTypes.tabs");
  return [
    { name: t("projectDetails"), value: "project-details", schema_id: SCHEMA_IDS.detailsView },
    { name: t("projectTerms"), value: "project-terms", schema_id: SCHEMA_IDS.projectTerms },
    { name: t("attachments"), value: "attachments", schema_id: SCHEMA_IDS.attachments },
    { name: t("contractors"), value: "contractors", schema_id: SCHEMA_IDS.contractors },
    { name: t("team"), value: "team", schema_id: SCHEMA_IDS.team },
    { name: t("rolesAndPermissions"), value: "roles-and-permissions", schema_id: SCHEMA_IDS.rolesAndPermissions },
    { name: t("projectSharing"), value: "project-sharing", schema_id: SCHEMA_IDS.projectSharing },
    { name: t("workOrders"), value: "work-orders", schema_id: SCHEMA_IDS.workOrders },
    { name: t("financial"), value: "financial", schema_id: SCHEMA_IDS.financial },
    { name: t("contractManagement"), value: "contract-management", schema_id: SCHEMA_IDS.contractManagement },
    { name: t("documentCycle"), value: "document-cycle", schema_id: SCHEMA_IDS.documentCycle },
  ];
}
