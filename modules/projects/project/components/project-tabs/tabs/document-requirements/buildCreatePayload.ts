import type {
  CreateProjectRequirementArgs,
  CreateProjectRequirementsArgs,
  ProjectRequirementRepetition,
} from "@/services/api/projects/project-requirements/types/params";
import type { RequirementEntry } from "./types";

/** Defaults for fields not collected in the current dialog UI */
const DEFAULT_STAGE = "Owner";
const DEFAULT_SENDING_ENTITY = "Consultant";
const DEFAULT_REVIEW_ENTITY = "Contractor";

export function buildCreateRequirementsPayload(
  entries: RequirementEntry[],
): CreateProjectRequirementsArgs {
  return {
    requirements: entries.map(buildRequirementArgs),
  };
}

function buildRequirementArgs(
  entry: RequirementEntry,
): CreateProjectRequirementArgs {
  const base: CreateProjectRequirementArgs = {
    requirement_code: entry.requirementCode.trim(),
    required_document_name: entry.requiredDocumentName.trim(),
    document: entry.document.trim(),
    procedure_setting_id: entry.procedureSettingId,
    document_type: entry.documentType,
    specialization: entry.specialization.trim() || null,
    stage: DEFAULT_STAGE,
    sending_entity: DEFAULT_SENDING_ENTITY,
    review_entity: DEFAULT_REVIEW_ENTITY,
    receiver_company_ids: entry.receiverCompanyIds,
    repetition: mapRepetition(entry),
  };

  if (entry.frequencyType === "day") {
    base.repetition_interval_type = "day";
    base.repeat_days =
      entry.selectedDays as CreateProjectRequirementArgs["repeat_days"];
  }

  if (entry.frequencyType === "week") {
    base.repetition_interval_type = "week";
  }

  if (entry.frequencyType === "month") {
    base.repetition_interval_type = "month";
  }

  return base;
}

function mapRepetition(entry: RequirementEntry): ProjectRequirementRepetition {
  switch (entry.frequencyType) {
    case "once":
      return "once";
    case "day":
      return "daily";
    case "week":
      return "weekly";
    case "month":
      return "monthly";
    default:
      return "once";
  }
}
