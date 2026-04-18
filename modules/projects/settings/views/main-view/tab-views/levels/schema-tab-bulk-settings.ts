import { ProjectTypesApi } from "@/services/api/projects/project-types";
import type {
  UpdateArchiveLibrarySettingsArgs,
  UpdateContractorContractSettingsArgs,
  UpdateDataSettingsArgs,
  UpdateEmployeeContractSettingsArgs,
  UpdateAttachmentCycleSettingsArgs,
  UpdateRolesAndPermissionsSettingsArgs,
  UpdateProjectSharingSettingsArgs,
} from "@/services/api/projects/project-types/types/args";
import type {
  ArchiveLibrarySettings,
  AttachmentCycleSettings,
  ContractorContractSettings,
  DataSettings,
  EmployeeContractSettings,
  RolesAndPermissionsSettings,
  ProjectSharingSettings,
} from "@/services/api/projects/project-types/types/response";

export const BULK_TOGGLE_SUPPORTED_TABS = new Set([
  "project-details",
  "attachments",
  "contractors",
  "team",
  "roles-and-permissions",
  "project-sharing",
  "document-cycle",
]);

/** Tabs grouped under «أصحاب المصلحة» in schema settings (not attachments / document-cycle). */
export const STAKEHOLDER_GROUP_TAB_VALUES = ["team", "roles-and-permissions", "project-sharing"] as const;

const DATA_SETTINGS_KEYS: (keyof UpdateDataSettingsArgs)[] = [
  "is_reference_number",
  "is_number_contract",
  "is_central_cost",
  "is_name_project",
  "is_start_date",
  "is_project_value",
  "is_achievement_percentage",
  "is_client",
  "is_responsible_engineer",
];

function isTruthySetting(v: unknown): boolean {
  return v === true || v === 1;
}

export function getTabBulkCheckboxState(
  tabValue: string,
  data: {
    dataSettings: DataSettings | null | undefined;
    archiveLibrary: ArchiveLibrarySettings | null | undefined;
    contractor: ContractorContractSettings | null | undefined;
    employee: EmployeeContractSettings | null | undefined;
    attachmentCycle: AttachmentCycleSettings | null | undefined;
    rolesAndPermissions: RolesAndPermissionsSettings | null | undefined;
    projectSharing: ProjectSharingSettings | null | undefined;
  },
): { checked: boolean; indeterminate: boolean } | null {
  if (!BULK_TOGGLE_SUPPORTED_TABS.has(tabValue)) return null;

  if (tabValue === "project-details") {
    const keys = DATA_SETTINGS_KEYS;
    const values = keys.map((k) => data.dataSettings?.[k]);
    const onCount = values.filter(isTruthySetting).length;
    if (onCount === 0) return { checked: false, indeterminate: false };
    if (onCount === keys.length) return { checked: true, indeterminate: false };
    return { checked: false, indeterminate: true };
  }

  if (tabValue === "attachments") {
    const v = data.archiveLibrary?.is_all_data_visible;
    if (v === undefined) return null;
    return {
      checked: isTruthySetting(v),
      indeterminate: false,
    };
  }

  if (tabValue === "contractors") {
    const v = data.contractor?.is_all_data_visible;
    if (v === undefined) return null;
    return {
      checked: isTruthySetting(v),
      indeterminate: false,
    };
  }

  if (tabValue === "team") {
    const v = data.employee?.is_all_data_visible;
    if (v === undefined) return null;
    return {
      checked: isTruthySetting(v),
      indeterminate: false,
    };
  }

  if (tabValue === "document-cycle") {
    const v = data.attachmentCycle?.is_all_data_visible;
    if (v === undefined) return null;
    return {
      checked: isTruthySetting(v),
      indeterminate: false,
    };
  }

  if (tabValue === "roles-and-permissions") {
    const v = data.rolesAndPermissions?.is_all_data_visible;
    if (v === undefined) return null;
    return {
      checked: isTruthySetting(v),
      indeterminate: false,
    };
  }

  if (tabValue === "project-sharing") {
    const v = data.projectSharing?.is_all_data_visible;
    if (v === undefined) return null;
    return {
      checked: isTruthySetting(v),
      indeterminate: false,
    };
  }

  return null;
}

/** Aggregate checkbox state for the stakeholder parent tab (all children must be fully on for checked). */
export function getStakeholderGroupBulkState(
  data: Parameters<typeof getTabBulkCheckboxState>[1],
): { checked: boolean; indeterminate: boolean } | null {
  const states = STAKEHOLDER_GROUP_TAB_VALUES.map((tabValue) =>
    getTabBulkCheckboxState(tabValue, data),
  );
  if (states.some((s) => s === null)) return null;
  const nonNull = states as { checked: boolean; indeterminate: boolean }[];
  const anyIndeterminate = nonNull.some((s) => s.indeterminate);
  if (anyIndeterminate) return { checked: false, indeterminate: true };
  const onCount = nonNull.filter((s) => s.checked && !s.indeterminate).length;
  if (onCount === 0) return { checked: false, indeterminate: false };
  if (onCount === nonNull.length) return { checked: true, indeterminate: false };
  return { checked: false, indeterminate: true };
}

export function isStakeholderGroupFullyEnabled(
  data: Parameters<typeof getTabBulkCheckboxState>[1],
): boolean {
  const state = getStakeholderGroupBulkState(data);
  return state?.checked === true && state.indeterminate === false;
}

/** True if every toggle in this tab is on; used to decide select-all vs clear-all. */
export function isTabFullyEnabled(
  tabValue: string,
  data: Parameters<typeof getTabBulkCheckboxState>[1],
): boolean {
  const state = getTabBulkCheckboxState(tabValue, data);
  return state?.checked === true && state.indeterminate === false;
}

export async function bulkToggleTabSettings(
  projectTypeId: number,
  tabValue: string,
  enable: boolean,
): Promise<void> {
  const v = enable ? 1 : 0;

  switch (tabValue) {
    case "project-details": {
      const payload = Object.fromEntries(
        DATA_SETTINGS_KEYS.map((k) => [k, v]),
      ) as UpdateDataSettingsArgs;
      await ProjectTypesApi.updateDataSettings(projectTypeId, payload);
      return;
    }
    case "attachments": {
      const payload: UpdateArchiveLibrarySettingsArgs = {
        is_all_data_visible: v,
      };
      await ProjectTypesApi.updateArchiveLibrarySettings(
        projectTypeId,
        payload,
      );
      return;
    }
    case "contractors": {
      const payload: UpdateContractorContractSettingsArgs = {
        is_all_data_visible: v,
      };
      await ProjectTypesApi.updateContractorContractSettings(
        projectTypeId,
        payload,
      );
      return;
    }
    case "team": {
      const payload: UpdateEmployeeContractSettingsArgs = {
        is_all_data_visible: v,
      };
      await ProjectTypesApi.updateEmployeeContractSettings(
        projectTypeId,
        payload,
      );
      return;
    }
    case "document-cycle": {
      const payload: UpdateAttachmentCycleSettingsArgs = {
        is_all_data_visible: v,
      };
      await ProjectTypesApi.updateAttachmentCycleSettings(
        projectTypeId,
        payload,
      );
      return;
    }
    case "roles-and-permissions": {
      const payload: UpdateRolesAndPermissionsSettingsArgs = {
        is_all_data_visible: v,
      };
      await ProjectTypesApi.updateRolesAndPermissionsSettings(
        projectTypeId,
        payload,
      );
      return;
    }
    case "project-sharing": {
      const payload: UpdateProjectSharingSettingsArgs = {
        is_all_data_visible: v,
      };
      await ProjectTypesApi.updateProjectSharingSettings(
        projectTypeId,
        payload,
      );
      return;
    }
    default:
      return;
  }
}
