import type { ProjectContractorDto } from "@/services/api/projects/project-contractors/types/response";
import type { ContractorRow } from "@/modules/projects/project/components/project-tabs/tabs/contractors/types";

function pickString(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

function resolveStatus(
  dto: ProjectContractorDto,
): ContractorRow["status"] {
  const raw = dto.status ?? dto.is_active;
  if (raw === true || raw === 1 || raw === "1") return "active";
  if (raw === false || raw === 0 || raw === "0") return "inactive";
  if (typeof raw === "string") {
    const key = raw.trim().toLowerCase();
    if (["active", "نشط", "enabled"].includes(key)) return "active";
    if (["inactive", "غير نشط", "disabled"].includes(key)) return "inactive";
  }
  return "active";
}

export function mapProjectContractorDto(
  dto: ProjectContractorDto,
): ContractorRow {
  return {
    id: String(dto.id),
    name: pickString(dto.name, dto.contractor_name),
    type: pickString(dto.type, dto.contractor_type, dto.activity),
    commercialRegister: pickString(
      dto.commercial_register,
      dto.commercialRegister,
    ),
    taxId: pickString(dto.tax_id, dto.tax_card),
    mobile: pickString(dto.mobile, dto.phone),
    email: pickString(dto.email),
    primaryContact: pickString(
      dto.primary_contact,
      dto.project_manager,
      dto.manager_name,
    ),
    classification: pickString(dto.classification),
    status: resolveStatus(dto),
  };
}
