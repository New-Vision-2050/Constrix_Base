import type { PendingShareInvitation } from "@/services/api/projects/project-sharing/types/response";
import type { ProjectRow } from "@/modules/projects/project/views/list/columns";

/** Stable key for document/resource type filters (maps from `shareable_type`). */
export type InboxTypeKey = "project" | "attachment" | "request" | "quote";

export type ProjectInboxRow = ProjectRow & {
  invitationId: string;
  sent_at_raw: string;
  sender_company_name: string;
  inbox_type_label: string;
  inbox_type_key: InboxTypeKey;
  invitation_status: string;
  reference_display: string;
  representative_name: string;
};

type InboxTypeTranslator = (key: string) => string;

export function mapShareableTypeKey(
  shareableType: string | undefined,
): InboxTypeKey {
  const s = (shareableType ?? "").toLowerCase();
  if (
    s.includes("attachment") ||
    s.includes("مرفق") ||
    s.includes("document") ||
    s.includes("file")
  )
    return "attachment";
  if (
    s.includes("quote") ||
    s.includes("quotation") ||
    s.includes("proposal") ||
    s.includes("عرض")
  )
    return "quote";
  if (s.includes("request") || s.includes("طلب")) return "request";
  return "project";
}

function mapShareableTypeLabel(
  shareableType: string | undefined,
  t: InboxTypeTranslator,
): string {
  const key = mapShareableTypeKey(shareableType);
  switch (key) {
    case "attachment":
      return t("typeAttachment");
    case "quote":
      return t("typeQuote");
    case "request":
      return t("typeRequest");
    default:
      return t("typeProject");
  }
}

export function mapPendingInvitationToRow(
  inv: PendingShareInvitation,
  tInbox: InboxTypeTranslator,
): ProjectInboxRow {
  const p = inv.project;
  const id = (p?.id ?? inv.shareable_id ?? inv.id) as string | number;
  const clientFromNested =
    p &&
    typeof p.client === "object" &&
    p.client !== null &&
    "name" in p.client
      ? String((p.client as { name?: string }).name ?? "")
      : "";
  const respEmp =
    p &&
    typeof p.responsible_employee === "object" &&
    p.responsible_employee !== null &&
    "name" in p.responsible_employee
      ? String(
          (p.responsible_employee as { name?: string }).name ?? "",
        )
      : "";

  const refPart =
    (p?.ref_number as string | undefined)?.trim() ||
    (p?.serial_number as string | undefined)?.trim() ||
    String(id ?? "");

  const sender =
    (inv.owner_company?.name?.trim() ||
      inv.shared_by?.name?.trim() ||
      (p?.client_name as string | undefined)?.trim() ||
      "") as string;

  const representative =
    (p?.responsible_employee_name as string | undefined)?.trim() ||
    respEmp ||
    (p?.manager_name as string | undefined)?.trim() ||
    "";

  const base: ProjectInboxRow = {
    invitationId: inv.id,
    id,
    serial_number: (p?.serial_number as string | undefined) ?? undefined,
    ref_number: (p?.ref_number as string | undefined) ?? undefined,
    name: (p?.name as string | undefined)?.trim()
      ? (p?.name as string)
      : (inv.notes?.trim() || ""),
    client_name: (p?.client_name as string | undefined) || undefined,
    project_owner_name:
      (p?.project_owner_name as string | undefined) ||
      clientFromNested ||
      undefined,
    manager_name: (p?.manager_name as string | undefined) ?? undefined,
    management_name: (p?.management_name as string | undefined) ?? undefined,
    branch_name: (p?.branch_name as string | undefined) ?? undefined,
    project_type_name: (p?.project_type_name as string | undefined) ?? undefined,
    sub_project_type: (p?.sub_project_type as string | undefined) ?? undefined,
    sub_project_type_name:
      (p?.sub_project_type_name as string | undefined) ?? undefined,
    sub_sub_project_type_name:
      (p?.sub_sub_project_type_name as string | undefined) ?? undefined,
    contract_number: (p?.contract_number as string | undefined) ?? undefined,
    start_date: (p?.start_date as string | undefined) ?? undefined,
    end_date: (p?.end_date as string | undefined) ?? undefined,
    completion_percentage:
      (p?.completion_percentage as number | undefined) ?? undefined,
    delay_percentage: (p?.delay_percentage as number | undefined) ?? undefined,
    status: (p?.status as number | undefined) ?? undefined,
    project_view: (p?.project_view as string | undefined) ?? undefined,
    responsible_employee_name:
      (p?.responsible_employee_name as string | undefined) || respEmp || undefined,
    sent_at_raw: inv.created_at ?? "",
    sender_company_name: sender,
    inbox_type_key: mapShareableTypeKey(inv.shareable_type),
    inbox_type_label: mapShareableTypeLabel(inv.shareable_type, tInbox),
    invitation_status: (inv.status ?? "").trim(),
    reference_display: refPart,
    representative_name: representative,
  };

  return base;
}
