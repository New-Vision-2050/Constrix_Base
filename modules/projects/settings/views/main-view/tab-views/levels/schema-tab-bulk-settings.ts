import { ProjectTypesApi } from "@/services/api/projects/project-types";
import type {
  UpdateAttachmentContractSettingsArgs,
  UpdateAttachmentTermsContractSettingsArgs,
  UpdateContractorContractSettingsArgs,
  UpdateDataSettingsArgs,
  UpdateEmployeeContractSettingsArgs,
} from "@/services/api/projects/project-types/types/args";
import type {
  AttachmentContractSettings,
  AttachmentTermsContractSettings,
  ContractorContractSettings,
  DataSettings,
  EmployeeContractSettings,
} from "@/services/api/projects/project-types/types/response";

export const BULK_TOGGLE_SUPPORTED_TABS = new Set([
  "project-details",
  "attachments",
  "contractors",
  "team",
]);

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

const ATTACHMENT_KEYS: (keyof UpdateAttachmentContractSettingsArgs)[] = [
  "is_name",
  "is_type",
  "is_size",
  "is_creator",
  "is_create_date",
  "is_downloadable",
];

function isTruthySetting(v: unknown): boolean {
  return v === true || v === 1;
}

export function getTabBulkCheckboxState(
  tabValue: string,
  data: {
    dataSettings: DataSettings | null | undefined;
    attachment: AttachmentContractSettings | null | undefined;
    attachmentTerms: AttachmentTermsContractSettings | null | undefined;
    contractor: ContractorContractSettings | null | undefined;
    employee: EmployeeContractSettings | null | undefined;
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
    const aKeys = ATTACHMENT_KEYS;
    const aVals = aKeys.map((k) => data.attachment?.[k]);
    const bVals = aKeys.map((k) => data.attachmentTerms?.[k]);
    const allVals = [...aVals, ...bVals];
    if (allVals.some((v) => v === undefined)) return null;
    const onCount = allVals.filter(isTruthySetting).length;
    const total = allVals.length;
    if (onCount === 0) return { checked: false, indeterminate: false };
    if (onCount === total) return { checked: true, indeterminate: false };
    return { checked: false, indeterminate: true };
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

  return null;
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
      const payloadA = Object.fromEntries(
        ATTACHMENT_KEYS.map((k) => [k, v]),
      ) as UpdateAttachmentContractSettingsArgs;
      const payloadB = Object.fromEntries(
        ATTACHMENT_KEYS.map((k) => [k, v]),
      ) as UpdateAttachmentTermsContractSettingsArgs;
      await Promise.all([
        ProjectTypesApi.updateAttachmentContractSettings(
          projectTypeId,
          payloadA,
        ),
        ProjectTypesApi.updateAttachmentTermsContractSettings(
          projectTypeId,
          payloadB,
        ),
      ]);
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
    default:
      return;
  }
}
