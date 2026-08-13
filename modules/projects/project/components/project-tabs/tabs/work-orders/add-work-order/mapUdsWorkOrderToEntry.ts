import type { ContractorRow } from "@/modules/projects/project/components/project-tabs/tabs/contractors/types";
import type { ProjectDistrictDto } from "@/services/api/projects/project-districts/types/response";
import type { ProjectManagementDto } from "@/services/api/projects/project-managements/types/response";
import type { ProjectOrderPermitTypeDto } from "@/services/api/projects/project-order-permits/types/response";
import type { UdsWorkOrderDto } from "@/services/api/projects/project-order-permits/types/response";

export type UdsWorkOrderEntryPatch = {
  workOrderId: string;
  workOrderType: string;
  assignmentDate: string;
  contractor: string;
  management: string;
  location: string;
  lat: string;
  long: string;
  price: string;
};

export type UdsWorkOrderLookups = {
  orderPermits: ProjectOrderPermitTypeDto[];
  contractors: ContractorRow[];
  managements: ProjectManagementDto[];
  districts: ProjectDistrictDto[];
};

function pickString(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

function normalizeKey(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

/** Maps `assigned_date` → تاريخ الإسناد (date input). */
function resolveAssignmentDate(value: string | null | undefined): string {
  const raw = value?.trim() ?? "";
  if (!raw) return "";

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const dmy = raw.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  }

  return raw.length >= 10 ? raw.slice(0, 10) : raw;
}

/** Maps `price` → السعر. */
function resolvePrice(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(String(value).replace(/,/g, ""));
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Maps `contractor.name` (inside contractor object) → المقاول.
 * Resolves to a project contractor id when a match exists.
 */
function resolveContractor(
  dto: UdsWorkOrderDto,
  contractors: ContractorRow[],
): string {
  const contractorObj = dto.contractor;

  if (contractorObj?.id != null && String(contractorObj.id).trim()) {
    const contractorId = String(contractorObj.id);
    if (contractors.some((item) => item.id === contractorId)) {
      return contractorId;
    }
  }

  const contractorName = pickString(
    contractorObj?.name,
    contractorObj?.contractor_name,
  );
  if (!contractorName) return "";

  const byName = contractors.find(
    (item) => normalizeKey(item.name) === normalizeKey(contractorName),
  );
  return byName?.id ?? "";
}

export function mapUdsWorkOrderToEntry(
  dto: UdsWorkOrderDto,
  _lookups: UdsWorkOrderLookups,
): UdsWorkOrderEntryPatch {
  return {
    workOrderId: "",
    workOrderType: "",
    assignmentDate: resolveAssignmentDate(dto.assigned_date),
    contractor: resolveContractor(dto, _lookups.contractors),
    management: "",
    location: "",
    lat: "",
    long: "",
    price: resolvePrice(dto.price),
  };
}
