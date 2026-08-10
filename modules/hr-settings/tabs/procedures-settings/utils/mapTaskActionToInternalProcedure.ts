import type { CreateInternalProcedureArgs } from "@/services/api/hr-settings/internal-procedure-settings/types/args";
import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import { coerceBoolean } from "@/services/api/hr-settings/internal-procedure-settings/normalize";
import type { TaskActionFormValues } from "../types";
import { mapConditionsToApiPayload } from "./conditionFormUtils";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUuid(value: string | null | undefined): value is string {
  return typeof value === "string" && UUID_RE.test(value.trim());
}

function buildInternalProcedurePayload(
  values: TaskActionFormValues,
  options: {
    procedureType: string;
    sortOrder: number;
    parentId?: string | null;
    projectId?: string | null;
    isActive?: boolean;
  },
): CreateInternalProcedureArgs {
  const payload: CreateInternalProcedureArgs = {
    name: values.name.trim(),
    type: options.procedureType,
    form: values.modelId,
    conditions: mapConditionsToApiPayload(values.conditions),
    appears_before_ids: values.appearBeforeIds.filter(Boolean),
    appears_after_ids: values.appearAfterIds.filter(Boolean),
    sort_order: options.sortOrder,
    is_active: coerceBoolean(values.isActive ?? options.isActive, true),
  };

  if (isValidUuid(options.parentId)) {
    payload.parent_id = options.parentId.trim();
  }

  if (options.projectId?.trim()) {
    payload.project_id = options.projectId.trim();
  }

  if (values.attachmentTypeId?.trim()) {
    payload.attachment_type_id = values.attachmentTypeId.trim();
  }
  if (values.attachmentSubTypeId?.trim()) {
    payload.attachment_sub_type_id = values.attachmentSubTypeId.trim();
  }
  if (values.attachmentSubSubTypeId?.trim()) {
    payload.attachment_sub_sub_type_id = values.attachmentSubSubTypeId.trim();
  }
  if (values.jobAttributeId?.trim()) {
    payload.job_attribute_id = values.jobAttributeId.trim();
  }
  if (typeof values.usedInDocumentCycle === "boolean") {
    payload.used_in_document_cycle = values.usedInDocumentCycle;
  }
  if (typeof values.showInAttachmentsLibrary === "boolean") {
    payload.appears_in_attachments_library = values.showInAttachmentsLibrary;
  }
  if (typeof values.showInArchiveAfterApproval === "boolean") {
    payload.appears_in_archive_after_approval =
      values.showInArchiveAfterApproval;
  }
  if (typeof values.requiresAssetId === "boolean") {
    payload.requires_asset_id = values.requiresAssetId;
  }

  if (values.receiverCompanyIds !== undefined) {
    payload.receiver_company_ids = values.receiverCompanyIds.filter(Boolean);
  }

  if (values.sourceProcedureSettingId?.trim()) {
    payload.source_procedure_setting_id =
      values.sourceProcedureSettingId.trim();
  }

  return payload;
}

export function mapTaskActionToCreateInternalProcedure(
  values: TaskActionFormValues,
  options: {
    procedureType: string;
    sortOrder: number;
    parentId?: string | null;
    projectId?: string | null;
  },
): CreateInternalProcedureArgs {
  const payload = buildInternalProcedurePayload(values, options);

  if (!payload.receiver_company_ids?.length) {
    delete payload.receiver_company_ids;
  }

  if (!payload.source_procedure_setting_id) {
    delete payload.source_procedure_setting_id;
  }

  return payload;
}

export function mapTaskActionToUpdateInternalProcedure(
  values: TaskActionFormValues,
  options: {
    procedureType: string;
    sortOrder: number;
    parentId?: string | null;
    projectId?: string | null;
    isActive?: boolean;
  },
): CreateInternalProcedureArgs {
  const payload = buildInternalProcedurePayload(values, options);
  delete payload.source_procedure_setting_id;

  if (!values.receiverCompanyIdsChanged) {
    delete payload.receiver_company_ids;
  }

  return payload;
}

export function resolveProcedureSettingId(
  procedure: Pick<InternalProcedure, "id" | "parent_id">,
): string {
  return procedure.parent_id ?? procedure.id;
}

function sameProcedureId(
  left: Pick<InternalProcedure, "id">,
  right: Pick<InternalProcedure, "id">,
): boolean {
  return String(left.id) === String(right.id);
}

/** Ordered internal_procedure items (children by sort_order, or root when alone). */
export function getSortedChildInternalProcedures(
  procedures: InternalProcedure[],
): InternalProcedure[] {
  if (!procedures.length) return [];

  const root = procedures.find((procedure) => !procedure.parent_id) ?? null;
  const children = root
    ? procedures.filter((procedure) =>
        sameProcedureId(
          { id: procedure.parent_id ?? "" },
          { id: root.id },
        ),
      )
    : procedures.filter((procedure) => !!procedure.parent_id);

  const list = children.length > 0 ? children : root ? [root] : [];

  return [...list]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const orderA = a.item.sort_order ?? a.index + 1;
      const orderB = b.item.sort_order ?? b.index + 1;
      if (orderA !== orderB) return orderA - orderB;
      return a.index - b.index;
    })
    .map(({ item }) => item);
}

/** The first internal procedure in the ordered list. */
export function getPrimaryInternalProcedure(
  procedures: InternalProcedure[],
): InternalProcedure | null {
  const sorted = getSortedChildInternalProcedures(procedures);
  return sorted[0] ?? null;
}

export function isPrimaryInternalProcedure(
  procedure: InternalProcedure,
  procedures: InternalProcedure[],
): boolean {
  const primary = getPrimaryInternalProcedure(procedures);
  return !!primary && sameProcedureId(primary, procedure);
}

export function getLastInternalProcedure(
  procedures: InternalProcedure[],
): InternalProcedure | null {
  const sorted = getSortedChildInternalProcedures(procedures);
  return sorted[sorted.length - 1] ?? null;
}

export function isLastInternalProcedure(
  procedure: InternalProcedure,
  procedures: InternalProcedure[],
): boolean {
  const last = getLastInternalProcedure(procedures);
  return !!last && sameProcedureId(last, procedure);
}
