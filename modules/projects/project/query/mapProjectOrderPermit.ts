import type { WorkOrderRow } from "@/modules/projects/project/components/project-tabs/tabs/work-orders/types";
import type { ProjectOrderPermitWorkOrderDto } from "@/services/api/projects/project-order-permits/types/response";

function pickString(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

function toNumber(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

function resolveDate(value: string | null | undefined): string {
  const raw = value?.trim() ?? "";
  return raw.length >= 10 ? raw.slice(0, 10) : raw;
}

function resolveCoordinate(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  return String(value);
}

export function mapProjectOrderPermitDto(
  dto: ProjectOrderPermitWorkOrderDto,
): WorkOrderRow {
  return {
    id: String(dto.id),
    workOrderId: pickString(dto.name),
    workOrderType: pickString(
      dto.order_permit?.type,
      dto.order_permit?.description,
      dto.order_permit?.code,
      dto.type,
    ),
    assignmentDate: resolveDate(dto.assigned_date),
    contractor: pickString(
      dto.contractor_name,
      dto.contractor?.name,
      dto.contractor?.contractor_name,
    ),
    management: pickString(
      dto.order_permit_department?.description,
      dto.order_permit_department?.code,
    ),
    location: pickString(dto.state_name, dto.state?.name),
    latitude: resolveCoordinate(dto.lat),
    longitude: resolveCoordinate(dto.long),
    price: toNumber(dto.price),
  };
}
